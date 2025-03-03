import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgIf
  ]
})
export class NavbarComponent implements OnInit {
  isUsersDropdownOpen: boolean = false;
  isQuizzesDropdownOpen: boolean = false;
  menuVisible: boolean = false;
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to current user changes
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      console.log('Current user in navbar:', user); // Debug log
    });
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

  // Helper methods to check user role
  isAdmin(): boolean {
    const isAdminUser = this.currentUser?.role === 'ADMIN';
    console.log('Is admin check:', isAdminUser); // Debug log
    return isAdminUser;
  }

  isTeacher(): boolean {
    const isTeacherUser = this.currentUser?.role === 'TEACHER';
    console.log('Is teacher check:', isTeacherUser); // Debug log
    return isTeacherUser;
  }

  isStudent(): boolean {
    const isStudentUser = this.currentUser?.role === 'STUDENT';
    console.log('Is student check:', isStudentUser); // Debug log
    return isStudentUser;
  }

  // Logout handler
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(route: string): void {
    this.isUsersDropdownOpen = false; // Close the dropdown
    this.router.navigate([route]);
  }
}