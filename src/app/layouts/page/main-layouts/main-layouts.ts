import { Component, inject, signal, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
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
  private cdRef = inject(ChangeDetectorRef);

  // --- UI State Variables (ตัวแปรคุมการแสดงผล) ---
  isYearDropdownOpen = signal<boolean>(false);
  isUserDropdownOpen = signal<boolean>(false);

  // --- Toggle Functions (ฟังก์ชันสลับสถานะเปิด/ปิด) ---
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  // สลับสถานะ Sidebar (ใช้กับปุ่ม Hamburger บน Mobile)
  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  // สลับเมนูเลือกปีงบประมาณ
  toggleYearDropdown() {
    // ✅ 3. ใช้ .update() เพื่อสลับค่า (true <-> false)
    this.isYearDropdownOpen.update(v => !v);

    // Logic: ถ้าเปิดเมนูปี ให้ปิดเมนู User
    // ✅ 4. อ่านค่าต้องมี () และกำหนดค่าใช้ .set()
    if (this.isYearDropdownOpen()) {
      this.isUserDropdownOpen.set(false);
    }
  }

  // สลับเมนูโปรไฟล์ผู้ใช้
  toggleUserDropdown() {
    this.isUserDropdownOpen.update(v => !v);

    if (this.isUserDropdownOpen()) {
      this.isYearDropdownOpen.set(false);
    }
  }

  // --- Actions (ฟังก์ชันทำงานเมื่อผู้ใช้คลิกเมนู) ---

  // เมื่อเลือกปีงบประมาณ
  selectYear(year: number) {
    this.configService.setBudgetYear(year);
    this.isYearDropdownOpen.set(false); // ✅ ปิด Dropdown
  }

  // ไปหน้าแก้ไขข้อมูลส่วนตัว
  onEditProfile() {
    console.log('Go to Edit Profile');
    this.isUserDropdownOpen.set(false); // ✅ ปิด Dropdown
    this.router.navigate(['/settings/profile']);
  }

  // ไปหน้าเปลี่ยนรหัสผ่าน
  onChangePassword() {
    console.log('Go to Change Password');
    this.isUserDropdownOpen.set(false);
    this.router.navigate(['/settings/password']);
  }

  // ออกจากระบบ
  logout() {
    this.isUserDropdownOpen.set(false);
    this.authService.logout();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.isActivated ? outlet.activatedRoute : '';
  }
}