import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Manage, RequestItem } from '@/app/manage-asset/service/manage';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-history-action',
  imports: [CommonModule, RouterLink],
  templateUrl: './history-action.html',
  styleUrl: './history-action.scss',
})
export class HistoryAction {
  private manageService = inject(Manage);
  historyList: RequestItem[] = [];

  constructor() { }

  ngOnInit(): void {
    // ดึงข้อมูลจาก Service
    this.manageService.getRecentHistory().subscribe((data: RequestItem[]) => {
      this.historyList = data;
    });
  }
}
