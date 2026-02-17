import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

export interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  position: string;
  organization: string; // หน่วยงาน
  department: string;   // สังกัด/กอง
  bio: string;
  avatarUrl: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class User {

  // จำลองข้อมูลใน Database
  private mockUser: UserProfile = {
    id: 'U-001',
    firstname: 'เบลล่า',
    lastname: 'นักวิชาการ',
    email: 'bell.dev@moph.go.th',
    phone: '081-234-5678',
    position: 'นักวิชาการคอมพิวเตอร์ปฏิบัติการ',
    organization: 'สำนักงานปลัดกระทรวงสาธารณสุข',
    department: 'กองบริหารการสาธารณสุข',
    bio: 'เชี่ยวชาญด้านการพัฒนาระบบสารสนเทศ (Full-stack) และสนใจเทคโนโลยี AI',
    avatarUrl: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png'
  };

  constructor() { }

  // 1. ดึงข้อมูลโปรไฟล์ (GET)
  getProfile(): Observable<UserProfile> {
    // delay 1 วินาที เพื่อจำลอง Network Latency
    return of({ ...this.mockUser }).pipe(delay(800));
  }

  // 2. อัปเดตข้อมูลโปรไฟล์ (PUT/PATCH)
  updateProfile(data: UserProfile): Observable<boolean> {
    this.mockUser = { ...data }; // อัปเดตข้อมูลใน mock
    return of(true).pipe(delay(1500)); // จำลองการบันทึก 1.5 วินาที
  }

  // 3. อัปโหลดรูปภาพ (POST)
  uploadAvatar(file: File): Observable<string> {
    // ในความเป็นจริงต้องส่ง FormData ไป API
    // อันนี้จำลองว่าส่งไปแล้วได้ URL กลับมา
    const mockUrl = URL.createObjectURL(file);
    return of(mockUrl).pipe(delay(1000));
  }

  changePassword(currentPass: string, newPass: string): Observable<boolean> {
    // จำลองการส่งข้อมูลไป Server
    // ในสถานการณ์จริง API จะเช็คว่า currentPass ถูกไหม
    return of(true).pipe(delay(1500));
  }
}
