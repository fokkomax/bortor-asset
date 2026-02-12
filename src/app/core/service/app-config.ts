import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppConfig {
  // 1. ค่าปีที่เลือกปัจจุบัน (เริ่มต้นให้เป็นปีปัจจุบันตามสูตร)
  currentBudgetYear = signal<number>(this.calculateCurrentFiscalYear());

  // 2. สร้าง List ย้อนหลัง 5 ปี อัตโนมัติ (ไม่ต้อง Hardcode Array)
  // ใช้ computed: ถ้า currentBudgetYear เปลี่ยน, list นี้จะเปลี่ยนตาม (ถ้าต้องการ)
  // หรือจะ fix ตามปีปัจจุบันก็ได้
  availableYears = computed(() => {
    const current = this.calculateCurrentFiscalYear();
    // สร้าง Array ย้อนหลัง 5 ปี [2570, 2569, 2568, 2567, 2566]
    return Array.from({ length: 5 }, (_, i) => current + 1 - i);
    // current + 1 เผื่อเลือกปีหน้าได้ 1 ปี
  });

  constructor() { }

  // ฟังก์ชันเปลี่ยนปี (เมื่อ User เลือกจาก Dropdown)
  setBudgetYear(year: number) {
    this.currentBudgetYear.set(year);
    console.log('App Context Changed:', year);
  }

  // --- Logic คำนวณปีงบประมาณไทยอัตโนมัติ ---
  private calculateCurrentFiscalYear(): number {
    const today = new Date();
    const yearAD = today.getFullYear(); // ค.ศ.
    const month = today.getMonth() + 1; // เดือน (1-12)

    // ปีงบประมาณไทยเริ่ม 1 ต.ค.
    // ถ้าเดือน >= 10 ให้บวก 1 ปี
    const fiscalYearAD = month >= 10 ? yearAD + 1 : yearAD;

    return fiscalYearAD + 543; // แปลงเป็น พ.ศ.
  }
}
