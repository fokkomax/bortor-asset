import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '@/app/core/service/auth';
import { MenuAction } from "../menu-action/menu-action";
import { HistoryAction } from "../history-action/history-action";

// ✅ Import Chart Module (ถ้าใช้ PrimeNG Chart)
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-request-action',
  imports: [CommonModule, RouterModule, MenuAction, HistoryAction, ChartModule],
  templateUrl: './request-action.html',
  styleUrl: './request-action.scss',
})
export class RequestAction {

  authService = inject(Auth);

  // --- 📊 ส่วน Logic กราฟ (ย้ายมาจาก Dashboard) ---
  data: any;
  options: any;

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    // const documentStyle = getComputedStyle(document.documentElement); // ❌ ลบอันนี้ออก ไม่ต้องใช้แล้ว
    // const textColor = documentStyle.getPropertyValue('--text-color'); // ❌ ลบอันนี้ออก

    this.data = {
      labels: ['อนุมัติแล้ว', 'รออนุมัติ', 'แก้ไข'],
      datasets: [
        {
          data: [12, 3, 1],
          backgroundColor: [
            '#22c55e', // ✅ สีเขียว (Green-500)
            '#eab308', // ✅ สีเหลือง (Yellow-500)
            '#ef4444'  // ✅ สีแดง (Red-500)
          ],
          hoverBackgroundColor: [
            '#4ade80', // ✅ สีเขียวอ่อน (Green-400)
            '#facc15', // ✅ สีเหลืองอ่อน (Yellow-400)
            '#f87171'  // ✅ สีแดงอ่อน (Red-400)
          ],
          borderWidth: 0 // (Optional) เอาเส้นขอบออกเพื่อให้ดู Clean ขึ้น
        }
      ]
    };

    this.options = {
      cutout: '75%', // ปรับความกว้างของรูตรงกลาง (60-80% กำลังสวย)
      plugins: {
        legend: {
          display: true, // แสดง Legend
          position: 'bottom', // เอาไว้ด้านล่าง
          labels: {
            color: '#475569', // สีเทา Slate-600
            font: { family: 'Prompt, sans-serif', size: 12 } // กำหนดฟอนต์ให้เข้ากับธีม
          }
        },
        tooltip: {
          enabled: true // แสดง Tooltip เมื่อเอาเมาส์ชี้
        }
      }
    };
  }

}
