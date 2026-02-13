import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-edit-request',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule, FileUploadModule, RouterLink],
  templateUrl: './edit-request.html',
  styleUrl: './edit-request.scss',
})
export class EditRequest {

  editForm: FormGroup;
  searchQuery = signal('');
  isSearching = signal(false);
  selectedAsset = signal<any>(null); // เก็บข้อมูลเดิม (Before)

  reasonOptions = [
    { label: 'บันทึกข้อมูลผิดพลาด (Human Error)', value: 'error' },
    { label: 'ปรับปรุงข้อมูลตามจริง (Update Specification)', value: 'update' },
    { label: 'โอนย้าย/เปลี่ยนหน่วยงาน', value: 'transfer' },
    { label: 'อื่นๆ', value: 'other' }
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.editForm = this.fb.group({
      // ข้อมูลใหม่ที่ต้องการแก้ไข (New Value)
      // ถ้าไม่แก้ ให้เป็นค่าว่าง หรือ null
      newName: [''],
      newPrice: [null],
      newBrand: [''],

      // ส่วนของคำขอ
      reason: ['', Validators.required],
      description: [''],
      files: [null]
    });
  }

  ngOnInit() { }

  // ... (ฟังก์ชัน Search เหมือนเดิม) ...
  onSearch() {
    if (!this.searchQuery()) return;
    this.isSearching.set(true);
    setTimeout(() => {
      // Mock ข้อมูลที่ไปดึงมาจาก DB
      this.selectedAsset.set({
        id: '7440-001-0001/60',
        name: 'เครื่องช่วยหายใจ (Ventilator)',
        brand: 'Bird / Vela',
        price: 850000,
        department: 'ER',
        status: 'Active'
      });
      this.isSearching.set(false);
    }, 800);
  }

  clearSelection() {
    this.selectedAsset.set(null);
    this.searchQuery.set('');
    this.editForm.reset();
  }

  // Helper เช็คว่ามีการแก้ไขค่าหรือไม่
  isModified(controlName: string): boolean {
    const control = this.editForm.get(controlName);
    return control ? (control.value && control.value !== '') : false;
  }

  submitRequest() {
    if (this.editForm.invalid) {
      alert('กรุณาระบุสาเหตุการแก้ไข');
      return;
    }

    // ✅ นี่คือจุดสำคัญ! สร้าง Object "คำขอใหม่" (New Request Payload)
    const requestPayload = {
      // 1. ระบุ Category ว่าเป็น "การแก้ไข"
      requestType: 'MODIFY',

      // 2. สถานะเริ่มต้นของคำขอ
      status: 'PENDING',
      requestDate: new Date(),

      // 3. อ้างอิงถึง Asset ตัวเดิม
      refAssetId: this.selectedAsset().id,

      // 4. เก็บ Snapshot ข้อมูลเดิม (เผื่อไว้เทียบตอนอนุมัติ)
      originalData: {
        name: this.selectedAsset().name,
        price: this.selectedAsset().price,
        brand: this.selectedAsset().brand
      },

      // 5. เก็บข้อมูลที่ "ขอเปลี่ยนแปลง" (เอาเฉพาะที่มีค่า)
      proposedChanges: {
        name: this.editForm.value.newName || null,   // ถ้าไม่แก้ ส่ง null ไป
        price: this.editForm.value.newPrice || null,
        brand: this.editForm.value.newBrand || null
      },

      // 6. เหตุผลประกอบ
      reasonCode: this.editForm.value.reason,
      reasonDescription: this.editForm.value.description
    };

    console.log('📦 Creating New Request (Category: Edit):', requestPayload);

    // TODO: เรียก API -> this.requestService.createRequest(requestPayload)...

    // เสร็จแล้วเด้งกลับไปหน้า History
    this.router.navigate(['/manage-asset/history']);
  }
}
