import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// PrimeNG (ถ้าจะใช้ร่วมกับ Tailwind)
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-new-request',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonModule, CheckboxModule, FileUploadModule],
  templateUrl: './new-request.html',
  styleUrl: './new-request.scss',
})
export class NewRequest {

  requestForm: FormGroup;

  // Signals สำหรับจัดการ UI State
  isChecking = signal(false); // หมุนๆ ตอนตรวจสอบ
  showSimilarity = signal(false); // โชว์กล่องแจ้งเตือนซ้ำ
  isDuplicateConfirmed = signal(false); // เช็คบ็อกซ์ยืนยัน

  constructor(private fb: FormBuilder, private router: Router) {
    this.requestForm = this.fb.group({
      itemName: ['', Validators.required],
      price: [null, Validators.required],
      assetType: ['ครุภัณฑ์การแพทย์'],
      servicePlan: ['', Validators.required],
      filesSpec: [null],
      filesQuotation: [null]
    });
  }

  ngOnInit() { }

  // จำลองฟังก์ชันตรวจสอบความซ้ำซ้อนเมื่อพิมพ์เสร็จ
  onNameChange(event: any) {
    const value = event.target.value;
    if (value.length > 5) {
      this.isChecking.set(true);
      this.showSimilarity.set(false);

      // จำลอง Delay 1.5 วินาที
      setTimeout(() => {
        this.isChecking.set(false);
        this.showSimilarity.set(true); // เจอรายการซ้ำ!
      }, 1500);
    } else {
      this.showSimilarity.set(false);
    }
  }

  toggleConfirmDuplicate() {
    this.isDuplicateConfirmed.update(v => !v);
  }

  saveDraft() {
    console.log('Saved Draft:', this.requestForm.value);
    // Logic บันทึก...
  }

  submitRequest() {
    if (this.requestForm.valid) {
      // ถ้ามีเตือนซ้ำ ต้องติ๊กยืนยันก่อน
      if (this.showSimilarity() && !this.isDuplicateConfirmed()) {
        alert('กรุณายืนยันว่ารายการนี้เป็นรายการใหม่');
        return;
      }
      console.log('Submitting:', this.requestForm.value);

      // บันทึกเสร็จแล้วพาไปหน้าประวัติ
      this.router.navigate(['/manage-asset/history']);
    } else {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }
  
}
