import { Component } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { Router } from '@angular/router'; // Add this import

@Component({
  selector: 'app-create-user',
  standalone: false,
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  user = { username: '', email: '', password: '', role: '' };
  roles = ['ADMIN', 'TEACHER', 'STUDENT'];
  successMessage = '';
  errorMessage = '';

  constructor(
    private userService: UserService,
    private router: Router // Inject the Router service
  ) {}

  onSubmit() {
    this.userService.createUser(this.user).subscribe({
      next: (response) => {
        this.successMessage = 'User successfully created!';
        console.log('User Created:', response);
        this.user = { username: '', email: '', password: '', role: '' };
        this.errorMessage = '';
        
        setTimeout(() => {
          this.router.navigate(['/users']); 
        }, 1500); // 1.5 second delay
      },
      error: (error) => {
        this.errorMessage = 'Failed to create user. Try again.';
        console.error('Error:', error);
      }
    });
  }
}