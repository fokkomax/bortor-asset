import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Expert, RequestDetail, DecisionType } from '@/app/expert/service/expert';

@Component({
  selector: 'app-expert-review-dispose',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './expert-review-dispose.html',
  styleUrl: './expert-review-dispose.scss',
})
export class ExpertReviewDispose {

  expertService = inject(Expert);
  route = inject(ActivatedRoute);
  router = inject(Router);

  detail = signal<RequestDetail | null>(null);
  comment = signal('');
  decision = signal<DecisionType | null>(null);
  isSubmitting = signal(false);

  ngOnInit() {
    // ดึง ID จาก URL (ในที่นี้ Mock ว่าเป็น '3')
    const id = this.route.snapshot.paramMap.get('id') || '3';
    this.expertService.getRequestDetail(id).subscribe(data => this.detail.set(data));
  }

  onSubmit() {
    if (!this.decision() || !this.comment()) return alert('กรุณาระบุข้อมูลให้ครบถ้วน');
    this.isSubmitting.set(true);
    // ส่งข้อมูลกลับไป Service
    this.expertService.submitReview(this.detail()!.id, this.decision(), this.comment()).subscribe(() => {
      this.router.navigate(['/expert/dashboard']);
    });
  }

}
