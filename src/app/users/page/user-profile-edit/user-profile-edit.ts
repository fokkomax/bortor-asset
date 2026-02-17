import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { User, UserProfile } from '@/app/users/service/user'; // import service

@Component({
  selector: 'app-user-profile-edit',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-profile-edit.html',
  styleUrl: './user-profile-edit.scss',
})
export class UserProfileEdit {

  // Inject Service แบบใหม่
  private userService = inject(User);

  // State สำหรับข้อมูล
  profile = signal<UserProfile>({
    id: '', firstname: '', lastname: '', email: '', phone: '',
    position: '', organization: '', department: '', bio: '', avatarUrl: null
  });

  // State สำหรับ Loading
  isLoading = signal(true);      // โหลดหน้าจอครั้งแรก
  isSubmitting = signal(false);  // กำลังกดบันทึก
  isUploading = signal(false);   // กำลังอัปโหลดรูป

  ngOnInit() {
    this.loadData();
  }

  // 1. ฟังก์ชันโหลดข้อมูลเริ่มต้น
  loadData() {
    this.isLoading.set(true);
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.isLoading.set(false);
      }
    });
  }

  // 2. ฟังก์ชันจัดการเลือกรูปภาพ
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isUploading.set(true);

      // เรียก Service อัปโหลด
      this.userService.uploadAvatar(file).subscribe({
        next: (newUrl) => {
          // อัปเดตเฉพาะ field avatarUrl ใน signal
          this.profile.update(p => ({ ...p, avatarUrl: newUrl }));
          this.isUploading.set(false);
        },
        error: () => {
          alert('อัปโหลดรูปภาพล้มเหลว');
          this.isUploading.set(false);
        }
      });
    }
  }

  // 3. ฟังก์ชันบันทึกข้อมูล
  onSubmit() {
    const p = this.profile();

    // Validation เบื้องต้น
    if (!p.firstname || !p.lastname || !p.phone) {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (*)');
      return;
    }

    this.isSubmitting.set(true);

    // เรียก Service บันทึก
    this.userService.updateProfile(p).subscribe({
      next: (success) => {
        if (success) {
          alert('บันทึกข้อมูลเรียบร้อยแล้ว');
          // อาจจะ redirect หรือ refresh state
        }
        this.isSubmitting.set(false);
      },
      error: () => {
        alert('เกิดข้อผิดพลาดในการบันทึก');
        this.isSubmitting.set(false);
      }
    });
  }

}
