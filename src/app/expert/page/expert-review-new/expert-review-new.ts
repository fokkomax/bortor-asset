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

  expertService = inject(Expert);
  route = inject(ActivatedRoute);
  router = inject(Router);

  detail = signal<RequestDetail | null>(null);

  // Form Signals
  comment = signal('');
  decision = signal<DecisionType | null>(null);
  isSubmitting = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '1';
    this.expertService.getRequestDetail(id).subscribe(data => {
      this.detail.set(data);
    });
  }

  onSubmit() {
    if (!this.decision() || !this.comment()) return alert('กรุณาระบุข้อมูลให้ครบถ้วน');

    this.isSubmitting.set(true);
    this.expertService.submitReview(this.detail()!.id, this.decision(), this.comment()).subscribe(() => {
      alert('บันทึกผลการพิจารณาเรียบร้อยแล้ว');
      this.router.navigate(['/expert/dashboard']);
    });
  }
}
