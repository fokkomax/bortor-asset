import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RequestDetail, DecisionType, Expert } from '@/app/expert/service/expert';

@Component({
  selector: 'app-expert-review-edit',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './expert-review-edit.html',
  styleUrl: './expert-review-edit.scss',
})
export class ExpertReviewEdit {

  expertService = inject(Expert);
  route = inject(ActivatedRoute);
  router = inject(Router);

  detail = signal<RequestDetail | null>(null);
  comment = signal('');
  decision = signal<DecisionType | null>(null);
  isSubmitting = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '2';
    this.expertService.getRequestDetail(id).subscribe(data => this.detail.set(data));
  }

  onSubmit() {
    if (!this.decision() || !this.comment()) return alert('กรุณาระบุข้อมูลให้ครบถ้วน');
    this.isSubmitting.set(true);
    this.expertService.submitReview(this.detail()!.id, this.decision(), this.comment()).subscribe(() => {
      this.router.navigate(['/expert/dashboard']);
    });
  }
}
