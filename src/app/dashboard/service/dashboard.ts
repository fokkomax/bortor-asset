import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Dashboard {
  
  constructor() { }

  getStats() {
    return of([
      { title: 'รายการทั้งหมด', count: '1,245', subtext: 'รายการทั้งหมด', icon: 'pi pi-folder', color: 'blue', change: '+12%' },
      { title: 'อยู่ระหว่างแก้ไข', count: '45', subtext: 'อยู่ระหว่างแก้ไข', icon: 'pi pi-pencil', color: 'rose', badge: 'Active' },
      { title: 'รอการตรวจสอบ', count: '12', subtext: 'รอการตรวจสอบ', icon: 'pi pi-bell', color: 'rose-gradient', badge: 'Action Needed' },
      { title: 'อนุมัติเรียบร้อย', count: '890', subtext: 'อนุมัติเรียบร้อย', icon: 'pi pi-check-circle', color: 'green' }
    ]);
  }

  getChartData() {
    return of({
      labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.'],
      datasets: [
        {
          label: 'รายการแก้ไข',
          data: [12, 19, 15, 25, 22, 30],
          borderColor: '#f43f5e',
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          fill: true
        },
        {
          label: 'นำเข้าใหม่',
          data: [5, 10, 8, 15, 12, 18],
          borderColor: '#22c55e',
          borderDash: [5, 5]
        }
      ]
    });
  }
}
