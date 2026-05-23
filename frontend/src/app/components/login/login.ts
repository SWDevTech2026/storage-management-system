import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * @class LoginComponent
 * @description Renders the login portal and authentication interface for system operators.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  /**
   * @method onLogin
   * @description Handles login submission actions and routes valid users to the central application dashboard.
   */
  onLogin(): void {
    const cleanCredentials = {
      username: this.credentials.username.trim(),
      password: this.credentials.password.trim(),
    };

    if (!cleanCredentials.username || !cleanCredentials.password) {
      this.errorMessage = 'Username and password fields cannot be left blank.';
      return;
    }

    // Fire off our updated auth pipeline
    this.authService.login(cleanCredentials).subscribe({
      next: (response) => {
        console.log('Login verification succeeded! Token cached.');

        // Force the browser view layout to navigate directly to the storage dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Authentication stream error:', err);
        this.errorMessage =
          err.error?.message || 'Authentication failed. Please verify credentials.';
      },
    });
  }
}
