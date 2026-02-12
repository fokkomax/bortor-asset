import { Component, OnInit, inject, OnDestroy } from '@angular/core'; // ตัด AfterViewInit ออกได้ครับ
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Dashboard } from '@/app/dashboard/service/dashboard';
import { Auth } from '@/app/core/service/auth';

Chart.register(...registerables);

@Component({
  selector: 'app-main-dashboard',
  imports: [CommonModule],
  templateUrl: './main-dashboard.html',
  styleUrl: './main-dashboard.scss',
})
export class MainDashboard {

  authService = inject(Auth);
  dashboardService = inject(Dashboard);

  stats: any[] = [];
  chartData: any;
  chart: any; // ✅ 1. เพิ่มตัวแปรเก็บ instance ของ Chart

  constructor() { }

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe(data => this.stats = data);

    // ✅ 2. ย้าย initChart มาไว้ใน subscribe
    // เพื่อให้มั่นใจว่า "มีข้อมูลแล้ว" ค่อยวาดกราฟ
    this.dashboardService.getChartData().subscribe(data => {
      this.chartData = data;
      this.initChart();
    });
  }

  // ไม่ต้องใช้ ngAfterViewInit แล้ว เพราะเรารอ Data โหลดเสร็จค่อยวาด

  initChart() {
    const canvas = document.getElementById('dashboardChart') as HTMLCanvasElement;

    if (canvas && this.chartData) {
      // ✅ 3. แก้ Error: Canvas is already in use
      // เช็คว่ามี Chart เดิมอยู่บน Canvas นี้ไหม ถ้ามีให้ทำลายทิ้งก่อน
      const existingChart = Chart.getChart(canvas);
      if (existingChart) {
        existingChart.destroy();
      }

      // ✅ 4. Assign ใส่ตัวแปร this.chart เพื่อเอาไว้ทำลายภายหลัง
      this.chart = new Chart(canvas, {
        type: 'line',
        data: this.chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top', align: 'end' } },
          scales: {
            y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
            x: { grid: { display: false } }
          }
        }
      });
    }
  }

  ngOnDestroy() {
    // ✅ 5. Cleanup เมื่อเปลี่ยนหน้า
    if (this.chart) {
      this.chart.destroy();
    }
  }

}
