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

  // 1. ข้อมูลจำลองสำหรับแสดงผล
  detail = signal({
    reqId: 'REQ-NEW-2570',
    title: 'เครื่องช่วยหายใจชนิดควบคุมปริมาตรและความดัน',
    similarityScore: 12,
    specs: [
      { label: 'ชื่อรายการ', value: 'เครื่องช่วยหายใจชนิดควบคุมปริมาตรและความดัน' },
      { label: 'ราคาต่อหน่วย', value: '850,000 บาท' },
      { label: 'ประเภทครุภัณฑ์', value: 'ครุภัณฑ์การแพทย์' },
      { label: 'Service Plan', value: 'สาขาอุบัติเหตุและฉุกเฉิน (Trauma)' }
    ],
    reasonType: 'เพื่อทดแทนรายการเดิมที่ชำรุดและเสื่อมสภาพ',
    reasonDetail: 'เครื่องเดิมใช้งานมานานกว่า 12 ปี มีค่าซ่อมบำรุงสูงและบริษัทเลิกผลิตอะไหล่แล้ว จำเป็นต้องจัดหาใหม่เพื่อรองรับผู้ป่วยวิกฤต'
  });

  // 2. ตัวแปรรับค่าจากฟอร์ม
  comment = signal('');
  // ✅ รองรับ 'reject' เพิ่มเข้ามา
  decision = signal<'approve' | 'return' | 'reject' | null>(null);

  isSubmitting = signal(false);

  onSubmit() {
    if (!this.comment() || !this.decision()) {
      alert('กรุณาระบุความเห็นและผลการพิจารณาให้ครบถ้วน');
      return;
    }

    this.isSubmitting.set(true);

    setTimeout(() => {
      console.log('บันทึกผล:', {
        reqId: this.detail().reqId,
        comment: this.comment(),
        decision: this.decision()
      });

      this.isSubmitting.set(false);
      alert('บันทึกผลการพิจารณาเรียบร้อยแล้ว');
      // this.router.navigate(['/expert/dashboard']);
    }, 1500);
  }
}
