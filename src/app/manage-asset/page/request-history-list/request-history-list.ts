import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { MenuItem } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DialogModule } from 'primeng/dialog';
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
    TooltipModule,
    SkeletonModule,
    SplitButtonModule,
    DialogModule],
  templateUrl: './request-history-list.html',
  styleUrl: './request-history-list.scss',
})
export class RequestHistoryList {

  // 1. ตัวแปรควบคุมการเปิด/ปิด Dialog
  displayModal = signal(false);

  // 2. ข้อมูลเมนู (Config) - แก้ไขตรงนี้ที่เดียว จบ!
  menuOptions = [
    {
      id: 'new',
      title: 'ลงทะเบียนใหม่',
      description: 'สำหรับครุภัณฑ์ที่เพิ่งได้รับมาใหม่ และยังไม่มีในระบบ',
      icon: 'pi pi-plus',
      route: '/manage-asset/new',
      theme: 'rose' // สีธีม: ชมพู
    },
    {
      id: 'edit',
      title: 'ขอแก้ไขรายการ',
      description: 'แก้ไขข้อมูลเดิมที่ผิดพลาด หรือปรับปรุงข้อมูลให้เป็นปัจจุบัน',
      icon: 'pi pi-file-edit',
      route: '/manage-asset/edit',
      theme: 'orange' // สีธีม: ส้ม
    },
    {
      id: 'dispose',
      title: 'ขอจำหน่าย',
      description: 'แจ้งจำหน่ายครุภัณฑ์ที่ชำรุด เสื่อมสภาพ หรือสูญหาย',
      icon: 'pi pi-trash',
      route: '/manage-asset/dispose',
      theme: 'red' // สีธีม: แดง
    }
  ];

  actionItems: MenuItem[] = [];
  // ✅ Inject Service ด้วยวิธีใหม่ (Angular 14+)
  private manageService = inject(Manage);
  private router = inject(Router);

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
    this.actionItems = [
      {
        label: 'ขอแก้ไขรายการเดิม',
        icon: 'pi pi-file-edit',
        command: () => this.createState('edit') // ไปหน้า search เพื่อแก้ไข
      },
      {
        label: 'ขอจำหน่าย/แทงจำหน่าย',
        icon: 'pi pi-trash',
        iconStyle: { color: 'var(--red-500)' }, // ใส่สีแดงให้ดูอันตราย
        command: () => this.createState('delete')
      }
    ];

    this.loadData();
  }

  // 3. ฟังก์ชันเปิด Dialog
  showCreateDialog() {
    this.displayModal.set(true);
  }

  // 4. ฟังก์ชันเมื่อเลือกเมนู (นำทาง + ปิด Dialog)
  onSelectMenu(route: string) {
    this.displayModal.set(false); // ปิด Dialog ก่อน

    // รอ Animation ปิดนิดนึงค่อยไป (Optional) หรือไปเลยก็ได้
    setTimeout(() => {
      this.router.navigate([route]);
    }, 100);
  }

  createState(type: string) {
    if (type === 'new') this.router.navigate(['/manage-asset/new']);
    if (type === 'edit') this.router.navigate(['/manage-asset/edit']); // หน้า Search ที่เพิ่งทำ
    if (type === 'delete') this.router.navigate(['/manage-asset/dispose']);
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

  // ฟังก์ชันสำหรับเลือกสีของประเภทคำขอ
  getTypeSeverity(type: string) {
    switch (type) {
      case 'NEW': return 'success';   // สีเขียว หรือ ฟ้า (ของใหม่)
      case 'MODIFY': return 'warning'; // สีส้ม (แก้ไข)
      case 'DELETE': return 'danger';  // สีแดง (จำหน่าย/ลบ)
      default: return 'info';
    }
  }

  getTypeLabel(type: string) {
    switch (type) {
      case 'import': return 'ขึ้นทะเบียนใหม่';
      case 'update': return 'ขอแก้ไขรายการ';
      case 'dispose': return 'ขอจำหน่าย';
      default: return type; // กรณีข้อมูลมาแปลกๆ ให้โชว์ค่า raw ไปเลย
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
