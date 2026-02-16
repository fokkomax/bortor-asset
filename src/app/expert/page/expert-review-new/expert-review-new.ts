import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RequestDetail, DecisionType, Expert } from '@/app/expert/service/expert';

@Component({
  selector: 'app-expert-review-new',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './expert-review-new.html',
  styleUrl: './expert-review-new.scss',
})
export class ExpertReviewNew {

  // 1. จำลองข้อมูลที่ดึงมาจาก API (เอาไว้แสดงผลใน HTML)
  detail = signal({
    reqId: 'REQ-NEW-2570',
    title: 'ขอขึ้นทะเบียนเครื่องช่วยหายใจ (Ventilator)',
    similarityScore: 12, // คะแนนความซ้ำซ้อน (AI Check)

    // ข้อมูลจำเพาะ (Card 1)
    specs: [
      { label: 'ชื่อรายการ', value: 'เครื่องช่วยหายใจชนิดควบคุมปริมาตรและความดัน' },
      { label: 'ราคาต่อหน่วย', value: '850,000 บาท' },
      { label: 'ประเภท', value: 'ครุภัณฑ์การแพทย์' },
      { label: 'สาขา (Service Plan)', value: 'สาขาอุบัติเหตุและฉุกเฉิน (Trauma)' }
    ],

    // เหตุผลความจำเป็น (Card 2)
    reasonType: 'เพื่อทดแทนรายการเดิมที่ชำรุดและเสื่อมสภาพ',
    reasonDetail: 'เครื่องเดิมใช้งานมานานกว่า 12 ปี มีค่าซ่อมบำรุงสูงและบริษัทเลิกผลิตอะไหล่แล้ว จำเป็นต้องจัดหาใหม่เพื่อรองรับผู้ป่วยวิกฤตที่มีจำนวนเพิ่มขึ้นเฉลี่ย 15% ต่อปี'
  });

  // 2. ตัวแปรรับค่าจาก Form (Card 3)
  comment = signal(''); // ความเห็นทางเทคนิค
  decision = signal<'approve' | 'return' | 'reject' | null>(null); // ผลการพิจารณา

  // 3. สถานะการทำงาน
  isSubmitting = signal(false);

  // 4. ฟังก์ชันบันทึก
  onSubmit() {
    // Validate ข้อมูล
    if (!this.comment() || !this.decision()) {
      alert('กรุณาระบุความเห็นและผลการพิจารณาให้ครบถ้วน');
      return;
    }

    this.isSubmitting.set(true);

    // จำลองการส่งข้อมูล (Simulate API Call)
    setTimeout(() => {
      console.log('บันทึกผลการพิจารณา:', {
        reqId: this.detail().reqId,
        comment: this.comment(),
        decision: this.decision()
      });

      this.isSubmitting.set(false);
      alert('บันทึกผลการพิจารณาเรียบร้อยแล้ว');
      // เพิ่ม Logic การ Redirect กลับหน้า Dashboard ตรงนี้
    }, 1500);
  }
}
