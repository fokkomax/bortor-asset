import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Report, SummaryStats, BudgetByRegion, TopAsset, ActivityLog } from '@/app/report/service/report';

@Component({
  selector: 'app-summary-report',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './summary-report.html',
  styleUrl: './summary-report.scss',
})
export class SummaryReport {

  service = inject(Report);

  // Signals
  stats = signal<SummaryStats | null>(null);
  budgetByRegion = signal<BudgetByRegion[]>([]);
  topAssets = signal<TopAsset[]>([]);
  activities = signal<ActivityLog[]>([]);

  currentYear = signal<string>('2569');
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);

    // Load all data
    this.service.getSummaryStats().subscribe(res => this.stats.set(res));
    this.service.getBudgetByRegion().subscribe(res => this.budgetByRegion.set(res));
    this.service.getTopAssets().subscribe(res => this.topAssets.set(res));
    this.service.getRecentActivities().subscribe(res => {
      this.activities.set(res);
      this.isLoading.set(false);
    });
  }

}
