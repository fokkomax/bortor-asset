import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { User } from '@/app/users/service/user'; // import service

@Component({
  selector: 'app-change-password',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePassword {

  private userService = inject(User);
  private router = inject(Router);

  // Form State
  form = signal({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Visibility State (Toggle Eye Icon)
  showCurrent = signal(false);
  showNew = signal(false);
  showConfirm = signal(false);

  // Loading State
  isSubmitting = signal(false);

  // Helper function: Toggle password visibility
  toggleVisibility(field: 'current' | 'new' | 'confirm') {
    if (field === 'current') this.showCurrent.update(v => !v);
    if (field === 'new') this.showNew.update(v => !v);
    if (field === 'confirm') this.showConfirm.update(v => !v);
  }

  // Submit function
  onSubmit() {
    const { currentPassword, newPassword, confirmPassword } = this.form();

    // 1. Validation: Check Empty
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    // 2. Validation: Check Match
    if (newPassword !== confirmPassword) {
      alert('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    // 3. Validation: Check Length (Optional)
    if (newPassword.length < 8) {
      alert('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
      return;
    }

    this.isSubmitting.set(true);

    // Call Service
    this.userService.changePassword(currentPassword, newPassword).subscribe({
      next: (success) => {
        this.isSubmitting.set(false);
        if (success) {
          alert('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
          // Redirect ไปหน้า Profile หรือ Login แล้วแต่ Flow
          this.router.navigate(['/expert/profile']);
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        alert('เกิดข้อผิดพลาด: รหัสผ่านปัจจุบันไม่ถูกต้อง หรือระบบขัดข้อง');
      }
    });
  }
}
