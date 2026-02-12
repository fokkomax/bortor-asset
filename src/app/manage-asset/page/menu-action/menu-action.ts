import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-action',
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-action.html',
  styleUrl: './menu-action.scss',
})
export class MenuAction {
  private router = inject(Router);
  constructor() { }

  // ฟังก์ชันสำหรับนำทางเมื่อคลิกการ์ด (ถ้าต้องการ)
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
