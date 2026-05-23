import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * @class AdminComponent
 * @description Locked interface designated for administrator operations including worker enrollment tasks.
 */
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class AdminComponent {
  userForm = { username: '', email: '', password: '' };
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService) {}

  /**
   * @method onRegisterUser
   * @description Processes credential creations using admin access pathways.
   */
  onRegisterUser(): void {
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.registerUser(this.userForm).subscribe({
      next: () => {
        this.successMessage = `Staff User account '${this.userForm.username}' registered successfully.`;
        this.userForm = { username: '', email: '', password: '' };
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Failed to construct system operator user context.';
      },
    });
  }
}
