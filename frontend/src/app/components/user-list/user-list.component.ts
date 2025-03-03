import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../../models/role';
import { User } from '../../models/user';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading: boolean = true;
  error: string | null = null;
  activeFilter: string = 'ALL';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        // Filter out ADMIN users
        this.users = data.filter(user => user.role !== Role.ADMIN);
        this.filteredUsers = [...this.users];
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading users', error);
        this.error = 'Failed to load users. Please try again.';
        this.loading = false;
      }
    });
  }

  filterByRole(role: string): void {
    this.activeFilter = role;
    if (role === 'ALL') {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(user => user.role === role);
    }
  }

  viewUserProfile(user: User): void {
    this.router.navigate(['/user-profile', user.id]);
  }

  getRoleClass(role: Role): string {
    switch (role) {
      case Role.TEACHER:
        return 'teacher-role';
      case Role.STUDENT:
        return 'student-role';
      default:
        return '';
    }
  }
}
