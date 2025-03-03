import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-update-user',
  standalone:false,
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  user = { id: 0, username: '', email: '', password: '', role: '' };
  roles = ['ADMIN', 'TEACHER', 'STUDENT'];
  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get user ID from route parameters
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loading = true;
      this.userService.getUserById(parseInt(userId, 10)).subscribe({
        next: (userData) => {
          // Populate form with user data
          this.user = { ...userData };
          // Clear password as it's typically not returned from the server
          this.user.password = '';
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load user data. Please try again.';
          console.error('Error loading user:', error);
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = 'No user ID provided.';
    }
  }

  onSubmit() {
    // Validate required fields, allowing empty password (in case it doesn't need to be updated)
    if (!this.user.username || !this.user.email || !this.user.role) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.loading = true;
    // If password is empty, create a user object without the password field
    const updateData = this.user.password 
      ? { ...this.user } 
      : { 
          id: this.user.id, 
          username: this.user.username, 
          email: this.user.email, 
          role: this.user.role 
        };

    this.userService.updateUser(updateData).subscribe({
      next: (response) => {
        this.successMessage = 'User successfully updated!';
        console.log('User Updated:', response);
        this.loading = false;
        // Navigate back to user list after short delay
        setTimeout(() => {
          this.router.navigate(['/users']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Failed to update user. Try again.';
        console.error('Error updating user:', error);
        this.loading = false;
      }
    });
  }

  cancelEdit() {
    this.router.navigate(['/users']);
  }
}