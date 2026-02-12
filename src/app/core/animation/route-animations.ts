import { trigger, transition, style, query, animate } from '@angular/animations';

export const fadeAnimation =
  trigger('fadeAnimation', [
    transition('* => *', [
      // ลบ :leave (หน้าเก่า) ออกไปเลย ให้มันหายไปตามธรรมชาติของ Router
      
      // จัดการหน้าใหม่ (:enter)
      query(':enter', [
        style({ 
          opacity: 0, 
          transform: 'translateY(20px) scale(0.98)', // ย่อลงนิดนึง + อยู่ต่ำกว่าปกตินิดหน่อย
          filter: 'blur(4px)' // ใส่เบลอนิดๆ ให้ดูพรีเมียม (ถ้าไม่ชอบลบออกได้)
        })
      ], { optional: true }),

      // สั่งเล่น Animation
      query(':enter', [
        animate('400ms cubic-bezier(0.2, 0, 0.2, 1)', style({ 
          opacity: 1, 
          transform: 'translateY(0) scale(1)',
          filter: 'blur(0)'
        }))
      ], { optional: true })
    ])
  ]);