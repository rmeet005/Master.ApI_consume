import { MaterialModule } from '../material/material-module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [MaterialModule,CommonModule,FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  role:any;
    constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
   ngOnInit() {
    this.role = localStorage.getItem("Role");
    console.log("User role from localStorage:", this.role);
}
}
