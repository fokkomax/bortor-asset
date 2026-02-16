import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Expert } from '@/app/expert/service/expert';

@Component({
  selector: 'app-expert-dashboard',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './expert-dashboard.html',
  styleUrl: './expert-dashboard.scss',
})
export class ExpertDashboard {

  expertService = inject(Expert);
  private route = inject(ActivatedRoute);

  // Local UI Signals
  searchQuery = signal('');
  activeTab = signal<'pending' | 'done'>('pending');

  ngOnInit() {
    // ✅ ดักจับ Query Params จาก URL
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'done') {
        this.activeTab.set('done');
      } else {
        this.activeTab.set('pending');
      }
    });
  }

  // Computed Signal: กรองข้อมูลอัตโนมัติเมื่อ tasks, search, หรือ tab เปลี่ยน
  filteredTasks = computed(() => {
    const allTasks = this.expertService.tasks();
    const query = this.searchQuery().toLowerCase();
    const tab = this.activeTab();

    return allTasks.filter(task => {
      // 1. Filter by Tab
      if (task.status !== tab) return false;

      // 2. Filter by Search
      if (!query) return true;
      return task.title.toLowerCase().includes(query) ||
        task.reqId.toLowerCase().includes(query) ||
        task.requester.toLowerCase().includes(query);
    });
  });

  // Helper เพื่อเลือก Link ไปหน้า Detail ตามประเภท
  getLink(type: string, id: string) {
    if (type === 'edit') {
      return ['/expert/review-edit', id];
    } else if (type === 'dispose') {
      // ✅ เพิ่มเงื่อนไขสำหรับหน้าจำหน่าย
      return ['/expert/review-dispose', id];
    } else {
      // กรณีอื่นๆ (เช่น 'new') ให้ไปหน้าเพิ่มใหม่
      return ['/expert/review-new', id];
    }
  }
}
