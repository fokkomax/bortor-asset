import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { Manage, RequestItem } from '@/app/manage-asset/service/manage';

@Component({
  selector: 'app-request-history-list',
  imports: [CommonModule,
    FormsModule,
    RouterLink,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    SelectModule,
    TooltipModule],
  templateUrl: './request-history-list.html',
  styleUrl: './request-history-list.scss',
})
export class RequestHistoryList {

  // ✅ Inject Service ด้วยวิธีใหม่ (Angular 14+)
  private manageService = inject(Manage);

  requests: WritableSignal<RequestItem[]> = signal<RequestItem[]>([]);
  loading: WritableSignal<boolean> = signal<boolean>(true);

  // ตัวเลือก Filter (คงเดิม เพราะเป็น Static Config ของหน้านี้)
  statuses: any[] = [
    { label: 'ทั้งหมด', value: null },
    { label: 'ร่างเอกสาร', value: 'draft' },
    { label: 'รอตรวจสอบ', value: 'pending' },
    { label: 'อนุมัติแล้ว', value: 'approved' },
    { label: 'ตีกลับ', value: 'rejected' }
  ];

  selectedStatus: any = null;

  constructor() { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // เซ็ตค่า loading เป็น true ก่อนเริ่มโหลด
    this.loading.set(true);

    this.manageService.getAllRequests().subscribe({
      next: (data) => {
        // ✅ 2. อัปเดตค่าด้วย .set()
        // Angular จะจับได้ทันทีว่าค่าเปลี่ยน และไปอัปเดตหน้าจอให้
        this.requests.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.loading.set(false);
      }
    });
  }

  // --- Helper Functions ---
  // (ฟังก์ชันพวกนี้เหมือนเดิม ไม่ต้องเปลี่ยนเป็น signal เพราะเป็นแค่ helper)

  getTypeSeverity(type: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (type) {
      case 'import': return 'success';
      case 'update': return 'info';
      case 'dispose': return 'warn';
      default: return 'secondary';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'import': return 'นำเข้าใหม่';
      case 'update': return 'ปรับปรุง';
      case 'dispose': return 'ตัดออก/จำหน่าย';
      default: return type;
    }
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warn';
      case 'rejected': return 'danger';
      case 'draft': return 'secondary';
      default: return 'info';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'approved': return 'อนุมัติแล้ว';
      case 'pending': return 'รอตรวจสอบ';
      case 'rejected': return 'ตีกลับ';
      case 'draft': return 'ร่างเอกสาร';
      default: return status;
    }
  }

  clear(table: any) {
    table.clear();
    this.selectedStatus = null;
  }

}
