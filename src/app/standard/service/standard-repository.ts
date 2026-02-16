import { Injectable, signal } from '@angular/core';
import { delay, of } from 'rxjs';

export interface AssetRevision {
  year: number;
  isActive: boolean;
  price: number;
  changes: { icon: string; text: string; isNegative?: boolean }[];
}

export interface HospitalAllocation {
  hospital: string;
  region: string;
  year: number;
  amount: number;
}

export interface StandardAssetProfile {
  id: string;
  code: string;
  name: string;
  currentPrice: number;
  revisions: AssetRevision[];
  allocations: HospitalAllocation[];
  approvalStats: {
    total: number;
    approved: number;
    rejected: number;
  };
}

export interface SearchResult {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  matchScore: number; // 0-100
  matchLevel: 'high' | 'medium' | 'low';
}

@Injectable({
  providedIn: 'root',
})
export class StandardRepository {

  // --- Mock Data: รายละเอียด (Detail) ---
  getAssetDetail(id: string) {
    const data: StandardAssetProfile = {
      id: id,
      code: '7440-001-0001/69',
      name: 'เครื่องช่วยหายใจชนิดควบคุมด้วยปริมาตร',
      currentPrice: 850000,
      revisions: [
        {
          year: 2569, isActive: true, price: 850000,
          changes: [
            { icon: 'pi-tag', text: 'เปลี่ยนชื่อจาก "เครื่องช่วยหายใจ (Volume)" เป็น "เครื่องช่วยหายใจชนิดควบคุมด้วยปริมาตร"' },
            { icon: 'pi-arrow-down', text: 'ปรับลดราคาลง 5% (จาก 890,000 เหลือ 850,000)', isNegative: true }
          ]
        },
        {
          year: 2567, isActive: false, price: 890000,
          changes: [{ icon: 'pi-cog', text: 'ปรับปรุงคุณลักษณะเฉพาะ (Spec) รองรับมาตรฐาน ISO ใหม่' }]
        },
        {
          year: 2562, isActive: false, price: 890000,
          changes: [{ icon: 'pi-plus-circle', text: 'ประกาศใช้งานครั้งแรก' }]
        }
      ],
      allocations: [
        { hospital: 'รพ.ราชวิถี', region: 'เขต 13', year: 2568, amount: 2 },
        { hospital: 'รพ.เชียงรายประชานุเคราะห์', region: 'เขต 1', year: 2568, amount: 1 },
        { hospital: 'รพ.ขอนแก่น', region: 'เขต 7', year: 2567, amount: 4 },
      ],
      approvalStats: { total: 142, approved: 105, rejected: 37 }
    };
    return of(data).pipe(delay(500));
  }

  // --- Mock Data: ค้นหา (Search) ---
  searchAssets(query: string) {
    // จำลองผลลัพธ์การค้นหา
    const results: SearchResult[] = [
      {
        id: '1', code: '7440-001/69', name: 'เครื่องวัดความดันโลหิตชนิดสอดแขน (Automatic)',
        description: 'คุณลักษณะเฉพาะ: แบบตั้งโต๊ะ วัดอัตโนมัติ แสดงผล digital...',
        price: 65000, matchScore: 95, matchLevel: 'high'
      },
      {
        id: '2', code: '7440-002/69', name: 'เครื่องวัดความดันโลหิตชนิดตั้งพื้น (Manual)',
        description: 'คุณลักษณะเฉพาะ: แบบมีล้อเลื่อน ใช้ปรอท หรือ Aneroid...',
        price: 4500, matchScore: 60, matchLevel: 'medium'
      },
      {
        id: '3', code: '7440-003/69', name: 'ชุดตรวจวัดสัญญาณชีพ (Vital Sign Monitor)',
        description: 'วัดความดันได้ในตัว พร้อมวัด SpO2 และ Temp',
        price: 85000, matchScore: 30, matchLevel: 'low'
      }
    ];
    return of(results).pipe(delay(800));
  }
}
