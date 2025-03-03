import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-display-users',
  standalone:false,
  templateUrl: './display-users.component.html',
  styleUrls: ['./display-users.component.css']
})
export class DisplayUsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

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
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading users. Please try again later.';
        console.error('Error fetching users:', error);
        this.loading = false;
      }
    });
  }

  deleteUser(userId: number | undefined): void {
    if (userId === undefined) {
      this.errorMessage = 'Cannot delete user with undefined ID';
      return;
    }
    
    if (confirm('Are you sure you want to delete this user?')) {
      this.loading = true;
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.successMessage = 'User deleted successfully!';
          // Remove the deleted user from the array
          this.users = this.users.filter(user => user.id !== userId);
          this.loading = false;
          // Clear the success message after a few seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete user. Please try again.';
          console.error('Error deleting user:', error);
          this.loading = false;
          // Clear the error message after a few seconds
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
  }

  updateUser(userId: number | undefined): void {
    if (userId === undefined) {
      this.errorMessage = 'Cannot update user with undefined ID';
      return;
    }
    this.router.navigate(['/update-user', userId]);
  }
}