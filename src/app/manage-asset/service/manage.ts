import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface RequestItem {
  id: string;
  topic: string;        // เปลี่ยนจาก title เพื่อสื่อถึงหัวข้อเรื่อง
  detail: string;
  type: 'import' | 'update' | 'dispose';
  requestDate: Date;    // เปลี่ยนเป็น Date Object เพื่อให้ Sort ในตารางได้ถูกต้อง
  budget: number;       // เพิ่มงบประมาณ
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  department: string;   // เพิ่มหน่วยงาน
}
@Injectable({
  providedIn: 'root',
})
export class Manage {
  constructor() { }

  // ข้อมูล Mock Data (ทำเป็นตัวแปร private ไว้ใช้ร่วมกัน)
  private mockData: RequestItem[] = [
    {
      id: 'REQ-69005',
      topic: 'เครื่องช่วยหายใจชนิดควบคุมปริมาตร',
      detail: 'จัดซื้อใหม่ทดแทนของเดิม',
      type: 'import',
      requestDate: new Date('2026-02-10'),
      budget: 850000,
      status: 'pending',
      department: 'อายุรกรรม'
    },
    {
      id: 'REQ-69004',
      topic: 'รถพยาบาลฉุกเฉิน (Ambulance)',
      detail: 'ย้ายหน่วยงานรับผิดชอบ',
      type: 'update',
      requestDate: new Date('2026-02-09'),
      budget: 0,
      status: 'draft',
      department: 'ยานพาหนะ'
    },
    {
      id: 'REQ-69003',
      topic: 'เครื่องคอมพิวเตอร์ AIO (ปี 2560)',
      detail: 'เสื่อมสภาพตามอายุการใช้งาน',
      type: 'dispose',
      requestDate: new Date('2026-02-08'),
      budget: 0,
      status: 'approved',
      department: 'เวชระเบียน'
    },
    {
      id: 'REQ-69002',
      topic: 'เตียงผู้ป่วยไฟฟ้า 3 ไกร์',
      detail: 'จำนวน 10 เตียง',
      type: 'import',
      requestDate: new Date('2026-02-05'),
      budget: 450000,
      status: 'rejected',
      department: 'ผู้ป่วยในชาย'
    },
    {
      id: 'REQ-69001',
      topic: 'เครื่องวัดความดันโลหิตอัตโนมัติ',
      detail: 'ขอเพิ่ม 5 เครื่อง',
      type: 'import',
      requestDate: new Date('2026-02-01'),
      budget: 25000,
      status: 'approved',
      department: 'OPD'
    },
    {
      id: 'REQ-68099',
      topic: 'เครื่องกระตุกหัวใจ (AED)',
      detail: 'ติดตั้งจุดประชาสัมพันธ์',
      type: 'import',
      requestDate: new Date('2026-01-28'),
      budget: 65000,
      status: 'approved',
      department: 'บริหาร'
    },
    {
      id: 'REQ-68098',
      topic: 'ชุดเก้าอี้พักคอยผู้ป่วย',
      detail: 'ชำรุดจากการใช้งาน',
      type: 'dispose',
      requestDate: new Date('2026-01-25'),
      budget: 0,
      status: 'approved',
      department: 'OPD'
    },
    {
      id: 'REQ-68097',
      topic: 'เครื่องปรับอากาศ 24000 BTU',
      detail: 'ย้ายห้อง Server',
      type: 'update',
      requestDate: new Date('2026-01-20'),
      budget: 5000,
      status: 'pending',
      department: 'IT'
    },
    {
      id: 'REQ-68096',
      topic: 'รถเข็นผู้ป่วย (Wheelchair)',
      detail: 'จัดซื้อเพิ่ม 20 คัน',
      type: 'import',
      requestDate: new Date('2026-01-15'),
      budget: 120000,
      status: 'approved',
      department: 'กายภาพบำบัด'
    },
    {
      id: 'REQ-68095',
      topic: 'เครื่องพิมพ์มัลติฟังก์ชั่น',
      detail: 'ทดแทนเครื่องเดิมที่ซ่อมไม่คุ้ม',
      type: 'dispose',
      requestDate: new Date('2026-01-10'),
      budget: 0,
      status: 'draft',
      department: 'บัญชี'
    }
  ];

  // 3. ฟังก์ชันสำหรับหน้า "ประวัติทั้งหมด" (Full List)
  getAllRequests(): Observable<RequestItem[]> {
    // delay(800) จำลองให้เหมือนโหลดจาก Server จริงๆ (หมุนติ้วๆ)
    return of(this.mockData).pipe(delay(800));
  }

  // 4. ฟังก์ชันสำหรับหน้า "Dashboard Widget" (เอาแค่ 5 รายการล่าสุด)
  getRecentHistory(): Observable<RequestItem[]> {
    return of(this.mockData.slice(0, 5));
  }
}
