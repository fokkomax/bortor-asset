import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { StandardRepository, StandardAssetProfile } from '@/app/standard/service/standard-repository';

@Component({
  selector: 'app-standard-asset-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './standard-asset-detail.html',
  styleUrl: './standard-asset-detail.scss',
})
export class StandardAssetDetail {

  service = inject(StandardRepository);
  route = inject(ActivatedRoute);

  data = signal<StandardAssetProfile | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '1';
    this.service.getAssetDetail(id).subscribe(res => this.data.set(res));
  }
}
