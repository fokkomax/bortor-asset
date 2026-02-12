import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, RouterOutlet, RouterOutletContract } from '@angular/router';
import { Auth } from '@/app/core/service/auth';
import { AppConfig } from '@/app/core/service/app-config';
import { Layouts } from '@/app/layouts/service/layouts';
import { fadeAnimation } from '@/app/core/animation/route-animations';

@Component({
  selector: 'app-main-layouts',
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './main-layouts.html',
  styleUrl: './main-layouts.scss',
  animations: [fadeAnimation] // ใส่ Animation ให้กับ Router Outlet
})
export class MainLayouts {

  // --- Dependency Injection (เรียกใช้ Service) ---
  // ใช้ inject() แทน Constructor (Modern Angular Style)
  authService = inject(Auth);       // ดูแลเรื่องข้อมูล User และการ Login/Logout
  configService = inject(AppConfig); // ดูแลเรื่องค่า Config กลาง (เช่น ปีงบประมาณ)
  layoutService = inject(Layouts); // Inject Layout Service
  private router = inject(Router);   // ใช้สำหรับสั่งเปลี่ยนหน้า (Navigate)

  // --- UI State Variables (ตัวแปรคุมการแสดงผล) ---
  isYearDropdownOpen = false;  // สถานะเปิด/ปิด Dropdown เลือกปี
  isUserDropdownOpen = false;  // สถานะเปิด/ปิด Dropdown เมนูผู้ใช้

  // --- Toggle Functions (ฟังก์ชันสลับสถานะเปิด/ปิด) ---

  // สลับสถานะ Sidebar (ใช้กับปุ่ม Hamburger บน Mobile)
  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  // สลับเมนูเลือกปีงบประมาณ
  toggleYearDropdown() {
    this.isYearDropdownOpen = !this.isYearDropdownOpen;
    // Logic: ถ้าเปิดเมนูปี ให้ปิดเมนู User อัตโนมัติ (กันมันซ้อนกัน)
    if (this.isYearDropdownOpen) this.isUserDropdownOpen = false;
  }

  // สลับเมนูโปรไฟล์ผู้ใช้
  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
    // Logic: ถ้าเปิดเมนู User ให้ปิดเมนูปี อัตโนมัติ
    if (this.isUserDropdownOpen) this.isYearDropdownOpen = false;
  }

  // --- Actions (ฟังก์ชันทำงานเมื่อผู้ใช้คลิกเมนู) ---

  // เมื่อเลือกปีงบประมาณ
  selectYear(year: number) {
    this.configService.setBudgetYear(year); // ส่งค่าไปอัปเดตที่ Service กลาง
    this.isYearDropdownOpen = false;        // เลือกเสร็จแล้วปิด Dropdown ทันที
  }

  // ไปหน้าแก้ไขข้อมูลส่วนตัว
  onEditProfile() {
    console.log('Go to Edit Profile');
    this.isUserDropdownOpen = false;         // ปิดเมนูก่อนเปลี่ยนหน้า
    this.router.navigate(['/settings/profile']); // สั่ง Router ให้เปลี่ยน URL
  }

  // ไปหน้าเปลี่ยนรหัสผ่าน
  onChangePassword() {
    console.log('Go to Change Password');
    this.isUserDropdownOpen = false;
    this.router.navigate(['/settings/password']);
  }

  // ออกจากระบบ
  logout() {
    this.isUserDropdownOpen = false;
    this.authService.logout(); // เรียก Service ให้จัดการเคลียร์ User และดีดออก
  }

  prepareRoute(outlet: RouterOutlet) {
    // ✅ 1. ต้องเช็คก่อนว่า outlet ทำงานอยู่ไหม (isActivated)
    // ถ้าไม่ Active ให้ return ค่าว่างไปเลย (เพื่อกัน Error NG04012)
    if (!outlet.isActivated) {
      return '';
    }

    // ✅ 2. ถ้า Active แล้ว ค่อยดึงข้อมูล
    // จะดึงจาก data animation (ถ้ามี) หรือใช้ตัว route เองเป็นตัว trigger ก็ได้
    return outlet.activatedRouteData?.['animation'] || outlet.activatedRoute;
  }
}