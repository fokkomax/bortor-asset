import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-dispose-request',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    CheckboxModule,
    AutoCompleteModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './dispose-request.html',
  styleUrl: './dispose-request.scss',
})
export class DisposeRequest {

  selectedSuggestion: any;
  filteredAssets: any[] = [];

  disposeForm: FormGroup;

  // State
  isSearching = signal(false);
  targetAsset = signal<any>(null); // รายการที่จะถูกลบ

  // Search Replacement
  filteredReplacements: any[] = [];

  // Mock Data: รายการทดแทน
  mockReplacements = [
    { name: 'เครื่องวัดความดันแบบ Digital (Omron)', code: 'MED-002-2024' },
    { name: 'เครื่องวัดความดันอัตโนมัติ (Automatic BP)', code: 'MED-003-2025' }
  ];

  reasonOptions = [
    { label: 'เทคโนโลยีล้าสมัย / เลิกผลิต (Obsolete)', value: 'obsolete' },
    { label: 'ซ้ำซ้อนกับรายการอื่น (Duplicate Entry)', value: 'duplicate' },
    { label: 'ไม่ปลอดภัย / ยกเลิกตามนโยบาย (Policy Change)', value: 'unsafe' },
    { label: 'รวมรายการ (Merge with other item)', value: 'merge' }
  ];

  effectiveOptions = [
    { label: 'ทันที (Immediately)', value: 'now' },
    { label: 'ปีงบประมาณหน้า (2571)', value: 'next_fiscal' }
  ];

  // Mock Data
  allAssets = [
    { id: '1001-001-0001', name: 'เครื่องคอมพิวเตอร์ประมวลผล (PC)', category: 'คอมพิวเตอร์', status: 'Active' },
    { id: '2005-002-0099', name: 'รถพยาบาลฉุกเฉิน (Ambulance)', category: 'ยานพาหนะ', status: 'Active' },
    { id: '3001-001-0005', name: 'เครื่องวัดความดันโลหิต', category: 'การแพทย์', status: 'Inactive' }
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.disposeForm = this.fb.group({
      searchTarget: [''], // ช่องค้นหาหลัก
      reason: ['', Validators.required],
      description: [''],
      hasReplacement: [true], // Checkbox มีรายการทดแทน
      replacementItem: [null], // เก็บ Object รายการทดแทน
      effectiveDate: ['now']
    });
  }

  ngOnInit() {
    // Demo: จำลองว่าเลือกรายการมาแล้ว (MED-001)
    this.mockSelectTarget();
  }

  mockSelectTarget() {
    this.targetAsset.set({
      id: 'MED-001-2020',
      name: 'เครื่องวัดความดันโลหิตแบบปรอท (Mercury Sphygmomanometer)',
      status: 'Active',
      year: '2560',
      usageCount: 1250
    });
  }

  // ฟังก์ชันค้นหารายการทดแทน (Auto Complete)
  filterReplacement(event: any) {
    const query = event.query.toLowerCase();
    this.filteredReplacements = this.mockReplacements.filter(item =>
      item.name.toLowerCase().includes(query) || item.code.toLowerCase().includes(query)
    );
  }

  submitRequest() {
    if (this.disposeForm.invalid) {
      alert('กรุณาระบุเหตุผลในการถอดถอน');
      return;
    }

    const payload = {
      requestType: 'DELETE', // หรือ DEPRECATE
      targetAssetId: this.targetAsset()?.id,
      reason: this.disposeForm.value.reason,
      description: this.disposeForm.value.description,
      replacement: this.disposeForm.value.hasReplacement ? this.disposeForm.value.replacementItem : null,
      effective: this.disposeForm.value.effectiveDate
    };

    console.log('🗑️ Submitting Dispose Request:', payload);
    this.router.navigate(['/manage-asset/history']);
  }

  // ฟังก์ชันค้นหา (Autocomplete)
  searchAsset(event: any) {
    const query = event.query.toLowerCase();
    // จำลองการค้นหา
    this.filteredAssets = this.allAssets.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.id.includes(query)
    );
  }

  // เมื่อเลือกรายการจาก Dropdown
  selectAsset(event: any) {
    this.targetAsset.set({
      id: event.value.id,
      name: event.value.name,
      status: event.value.status,
      year: '2565',
      usageCount: 154
    });
  }

  // ปุ่มเปลี่ยนรายการ
  clearTarget() {
    this.targetAsset.set(null);
    this.selectedSuggestion = null;
  }

}
