import { Injectable, signal, computed } from '@angular/core';
import { delay, of, tap } from 'rxjs';

export type RequestType = 'new' | 'edit' | 'dispose';
export type SLAStatus = 'ปกติ' | 'เร่งด่วน' | 'เหลือ 2 วัน' | 'เลยกำหนด';
export type DecisionType = 'approve' | 'return' | 'reject';

export interface ExpertTask {
  id: string;
  reqId: string;
  title: string;
  requester: string;
  type: RequestType;
  submitDate: string;
  sla: SLAStatus;
  isUrgent: boolean;
  status: 'pending' | 'done'; // สถานะงาน
}

export interface ExpertStats {
  pending: number;
  doneToday: number;
  total: number;
}

export interface ComparisonItem {
  label: string;
  oldValue: string;
  newValue: string;
  isChanged: boolean;
}

export interface RequestDetail {
  id: string;
  reqId: string;
  title: string;
  type: RequestType;
  requester: string;
  submitDate: string;
  price: number;
  // เฉพาะรายการใหม่
  similarityScore?: number;
  specs?: { label: string; value: string }[];
  // เฉพาะรายการแก้ไข
  comparisons?: ComparisonItem[];
  editReason?: string;
  // ✅ เฉพาะรายการจำหน่าย (Dispose)
  disposeReason?: string;      // เหตุผลการจำหน่าย
  assetCode?: string;          // รหัสครุภัณฑ์
  purchaseDate?: string;       // วันที่ซื้อ (อายุการใช้งาน)
  currentValue?: number;       // มูลค่าปัจจุบัน (Book Value)
  condition?: string;          // สภาพปัจจุบัน
  evidencePhotos?: string[];   // รูปถ่ายสภาพความเสียหาย
}

@Injectable({
  providedIn: 'root',
})


export class Expert {

  // --- State Signals (Source of Truth) ---
  // ใช้ signal เก็บข้อมูลเพื่อให้ Component ปลายทาง update อัตโนมัติ
  tasks = signal<ExpertTask[]>([]);
  stats = signal<ExpertStats>({ pending: 0, doneToday: 0, total: 0 });
  isLoading = signal<boolean>(false);

  // --- Mock Data ---
  private mockTasks: ExpertTask[] = [
    {
      id: '1', reqId: 'REQ-2570/001', title: 'เครื่องช่วยหายใจชนิดควบคุมด้วยปริมาตร',
      requester: 'รพ.ราชวิถี', type: 'new', submitDate: '10 ก.พ. 69 (10:30 น.)',
      sla: 'เหลือ 2 วัน', isUrgent: false, status: 'pending'
    },
    {
      id: '2', reqId: 'REQ-2570/005', title: 'เตียงผู้ป่วยไฟฟ้า (3 ไกร์)',
      requester: 'สสจ.นนทบุรี', type: 'edit', submitDate: '09 ก.พ. 69 (14:00 น.)',
      sla: 'เร่งด่วน', isUrgent: true, status: 'pending'
    },
    {
      id: '3', reqId: 'REQ-2570/012', title: 'เครื่องวัดความดันแบบปรอท (Mercury)',
      requester: 'กองบริหารฯ', type: 'dispose', submitDate: 'เมื่อวานนี้',
      sla: 'ปกติ', isUrgent: false, status: 'pending'
    },
    {
      id: '4', reqId: 'REQ-2570/099', title: 'รถพยาบาลฉุกเฉิน (Ambulance)',
      requester: 'รพ.เชียงราย', type: 'new', submitDate: '01 ก.พ. 69',
      sla: 'ปกติ', isUrgent: false, status: 'done'
    }
  ];

  constructor() {
    this.loadInitialData();
  }

  // จำลองการโหลดข้อมูลครั้งแรก
  loadInitialData() {
    this.isLoading.set(true);

    // Simulate API Call
    setTimeout(() => {
      this.tasks.set(this.mockTasks);
      this.updateStats();
      this.isLoading.set(false);
    }, 800);
  }

  // อัปเดตตัวเลข Stats อัตโนมัติจาก Tasks
  private updateStats() {
    const currentTasks = this.tasks();
    this.stats.set({
      pending: currentTasks.filter(t => t.status === 'pending').length,
      doneToday: currentTasks.filter(t => t.status === 'done').length,
      total: currentTasks.length
    });
  }

  // --- Methods สำหรับ Component เรียกใช้ ---

  // ดึงรายละเอียด (Mock Detail ตาม ID)
  getRequestDetail(id: string) {
    // ในโปรเจกต์จริงยิง API by ID
    const isEdit = id === '2'; // สมมติ ID 2 เป็นเคสแก้ไข

    const detail: RequestDetail = {
      id: id,
      reqId: isEdit ? 'REQ-2570/005' : 'REQ-2570/001',
      title: isEdit ? 'เตียงผู้ป่วยไฟฟ้า (3 ไกร์)' : 'เครื่องช่วยหายใจชนิดควบคุมด้วยปริมาตร',
      type: isEdit ? 'edit' : 'new',
      requester: isEdit ? 'สสจ.นนทบุรี' : 'รพ.ราชวิถี',
      submitDate: '10 ก.พ. 69',
      price: 850000,
      // Data สำหรับ New
      similarityScore: 12,
      specs: [
        { label: 'ราคาต่อหน่วย', value: '850,000 บาท' },
        { label: 'Service Plan', value: 'สาขาโรคหัวใจ' },
        { label: 'ยี่ห้อ/รุ่น', value: 'Vela Diamond' }
      ],
      // Data สำหรับ Edit
      editReason: 'อัพเกรด Firmware ตามมาตรฐานใหม่ของกระทรวง',
      comparisons: [
        { label: 'คุณลักษณะเฉพาะ', oldValue: 'Vela Standard (v1.0)', newValue: 'Vela Plus (v2.5)', isChanged: true },
        { label: 'ราคา', oldValue: '850,000', newValue: '850,000', isChanged: false }
      ]
    };

    // ✅ เพิ่ม Mock Case สำหรับ Dispose (สมมติ ID = '3')
    if (id === '3') {
      const disposeDetail: RequestDetail = {
        id: '3',
        reqId: 'REQ-2570/012',
        title: 'เครื่องวัดความดันแบบปรอท (Mercury)',
        type: 'dispose',
        requester: 'กองบริหารการสาธารณสุข',
        submitDate: 'เมื่อวานนี้',
        price: 2500, // ราคาซื้อเดิม

        // Data เฉพาะ Dispose
        assetCode: '7440-001-0001/55',
        purchaseDate: '15 มี.ค. 2555 (อายุ 12 ปี)',
        currentValue: 0, // ตัดค่าเสื่อมหมดแล้ว
        disposeReason: 'ชำรุดตามสภาพการใช้งาน ไม่สามารถซ่อมแซมได้คุ้มค่า (Beyond Repair) และมีนโยบายเลิกใช้สารปรอทในสถานพยาบาล',
        condition: 'ยางเปื่อยยุ่ย ปรอทรั่วซึม ตัวถังสนิมเกาะ',
        evidencePhotos: [
          'https://placehold.co/400x300/fee2e2/991b1b?text=Damage+1',
          'https://placehold.co/400x300/fee2e2/991b1b?text=Damage+2'
        ]
      };
      return of(disposeDetail).pipe(delay(500));
    }

    return of(detail).pipe(delay(500));
  }

  // บันทึกผลการพิจารณา (และอัปเดต State หน้า Dashboard ทันที)
  submitReview(id: string, decision: any, comment: string) {
    this.isLoading.set(true);

    return of(true).pipe(
      delay(1000), // จำลอง network delay
      tap(() => {
        // อัปเดต State ใน Service: ย้ายงานจาก Pending -> Done
        this.tasks.update(tasks => tasks.map(t => {
          if (t.id === id) {
            return { ...t, status: 'done' };
          }
          return t;
        }));

        this.updateStats(); // คำนวณตัวเลขใหม่
        this.isLoading.set(false);
      })
    );
  }

}
