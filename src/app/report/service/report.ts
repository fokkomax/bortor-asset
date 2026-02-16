import { Injectable } from '@angular/core';
import { delay, of, Observable } from 'rxjs';

export interface SummaryStats {
  totalBudget: number;
  totalBudgetDiffPercent: number; // % เทียบปีก่อน
  approvedBudget: number;
  approvedBudgetPercent: number; // % เทียบคำขอ
  totalRequests: number;
  pendingRequests: number;
  reviseRequests: number;
  avgProcessTime: number; // วัน
}

export interface BudgetByRegion {
  region: string;
  amount: number; // จำนวนเงิน
  percent: number; // ความสูงกราฟ %
}

export interface RequestStatusRatio {
  status: string;
  count: number;
  percent: number;
  colorClass: string; // class สี เช่น bg-emerald-500
}

export interface TopAsset {
  name: string;
  count: number;
  percent: number; // ความยาว bar %
  rank: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  detail: string;
  time: string;
  icon: string;
  iconBgClass: string;
  iconTextClass: string;
}

@Injectable({
  providedIn: 'root',
})
export class Report {

  getSummaryStats(): Observable<SummaryStats> {
    const data: SummaryStats = {
      totalBudget: 125400000,
      totalBudgetDiffPercent: 12,
      approvedBudget: 84200000,
      approvedBudgetPercent: 67,
      totalRequests: 1240,
      pendingRequests: 45,
      reviseRequests: 12,
      avgProcessTime: 3.5
    };
    return of(data).pipe(delay(500));
  }

  getBudgetByRegion(): Observable<BudgetByRegion[]> {
    const data: BudgetByRegion[] = [
      { region: 'เขต 1', amount: 60000000, percent: 60 },
      { region: 'เขต 4', amount: 85000000, percent: 85 },
      { region: 'เขต 7', amount: 40000000, percent: 40 },
      { region: 'เขต 10', amount: 55000000, percent: 55 },
      { region: 'เขต 13', amount: 70000000, percent: 70 },
    ];
    return of(data).pipe(delay(600));
  }

  getTopAssets(): Observable<TopAsset[]> {
    const data: TopAsset[] = [
      { rank: 1, name: 'เครื่องช่วยหายใจ (Volume)', count: 154, percent: 85 },
      { rank: 2, name: 'เครื่องวัดสัญญาณชีพ (Monitor)', count: 120, percent: 65 },
      { rank: 3, name: 'เตียงผู้ป่วยไฟฟ้า (ICU)', count: 98, percent: 50 },
      { rank: 4, name: 'เครื่องกระตุกหัวใจ (AED)', count: 75, percent: 40 },
      { rank: 5, name: 'เครื่องอัลตราซาวด์ (Portable)', count: 45, percent: 25 },
    ];
    return of(data).pipe(delay(700));
  }

  getRecentActivities(): Observable<ActivityLog[]> {
    const data: ActivityLog[] = [
      { id: '1', action: 'อนุมัติคำขอ REQ-2570/085', detail: 'โดย นพ.สมชาย • เครื่องช่วยหายใจ • รพ.ราชวิถี', time: '10 นาทีที่แล้ว', icon: 'pi-check', iconBgClass: 'bg-green-100', iconTextClass: 'text-green-600' },
      { id: '2', action: 'ส่งกลับแก้ไข REQ-2570/084', detail: 'โดย คณะกรรมการฯ • รายละเอียดสเปกไม่ครบถ้วน', time: '1 ชั่วโมงที่แล้ว', icon: 'pi-pencil', iconBgClass: 'bg-orange-100', iconTextClass: 'text-orange-600' },
      { id: '3', action: 'สร้างคำขอใหม่ REQ-2570/089', detail: 'โดย สสจ.เชียงใหม่ • รถพยาบาลฉุกเฉิน', time: '2 ชั่วโมงที่แล้ว', icon: 'pi-plus', iconBgClass: 'bg-blue-100', iconTextClass: 'text-blue-600' },
    ];
    return of(data).pipe(delay(800));
  }

}
