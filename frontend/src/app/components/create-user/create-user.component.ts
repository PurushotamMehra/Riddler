import { Component } from '@angular/core';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-create-user',
  standalone:false,
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'] // Fixed styleUrl to styleUrls
})
export class CreateUserComponent {
  user = { username: '', email: '', password: '', role: '' };
  roles = ['ADMIN', 'TEACHER', 'STUDENT'];
  successMessage = '';
  errorMessage = '';

  constructor(private userService: UserService) {}

  onSubmit() {
    this.userService.createUser(this.user).subscribe({
      next: (response) => {
        this.successMessage = 'User successfully created!';
        console.log('User Created:', response);
      },
      error: (error) => {
        this.errorMessage = 'Failed to create user. Try again.';
        console.error('Error:', error);
      }
    });
  }
}
