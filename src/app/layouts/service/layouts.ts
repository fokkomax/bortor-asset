import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Layouts {
  
  isSidebarOpen = signal<boolean>(false);

  constructor() { }

  toggleSidebar() {
    this.isSidebarOpen.update(value => !value);
  }

  setSidebarState(isOpen: boolean) {
    this.isSidebarOpen.set(isOpen);
  }
}