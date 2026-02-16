import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StandardRepository, SearchResult } from '@/app/standard/service/standard-repository';

@Component({
  selector: 'app-smart-asset-check',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './smart-asset-check.html',
  styleUrl: './smart-asset-check.scss',
})
export class SmartAssetCheck {

  service = inject(StandardRepository);

  query = signal('');
  results = signal<SearchResult[]>([]);
  isLoading = signal(false);
  hasSearched = signal(false);

  onSearch() {
    if (!this.query()) return;
    this.isLoading.set(true);
    this.hasSearched.set(true);
    this.service.searchAssets(this.query()).subscribe(res => {
      this.results.set(res);
      this.isLoading.set(false);
    });
  }
}
