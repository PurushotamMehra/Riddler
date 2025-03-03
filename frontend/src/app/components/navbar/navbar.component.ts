/// navbar.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  // standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent implements OnInit {
  @Input() userRole: string = 'STUDENT'; // This can be set from parent component
  isUsersDropdownOpen: boolean = false;
  isQuizzesDropdownOpen: boolean = false;
  menuVisible: boolean = false; // ✅ Added this to fix the error

  constructor() { }

  ngOnInit(): void {
    // You can add any initialization logic here
  }

  toggleUsersDropdown(): void {
    this.isUsersDropdownOpen = !this.isUsersDropdownOpen;
    // Close other dropdowns when opening this one
    if (this.isUsersDropdownOpen) {
      this.isQuizzesDropdownOpen = false;
    }
  }

  toggleQuizzesDropdown(): void {
    this.isQuizzesDropdownOpen = !this.isQuizzesDropdownOpen;
    // Close other dropdowns when opening this one
    if (this.isQuizzesDropdownOpen) {
      this.isUsersDropdownOpen = false;
    }
  }
}
