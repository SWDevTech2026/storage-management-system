import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

/**
 * @class AuthService
 * @description Manages authentication workflows, token storage, and active user session states.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  /**
   * @method login
   * @description Submits credentials to the backend and saves the returned JWT token if successful.
   * @param {any} credentials Payload containing username and password fields.
   */
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res && res.access_token) {
          localStorage.setItem('storage_jwt', res.access_token);
        }
      }),
    );
  }

  /**
   * @method getUserRole
   * @description Decodes the cached JWT token payload string to extract the user's access role profile.
   */
  getUserRole(): string {
    const token = localStorage.getItem('storage_jwt');
    if (!token) return 'user'; // Default to lowest privilege if missing

    try {
      // Split the JWT string and decode the middle base64 payload segment
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      return decodedPayload.role || 'user'; // Extract the role property
    } catch (e) {
      console.error('Failed to parse active user payload token properties:', e);
      return 'user';
    }
  }

  /**
   * @method registerUser
   * @description Allows administrators to register a new user account.
   */
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      ...userData,
      adminPassphrase: 'admin-root-key', // Matches backend verification parameter
    });
  }

  /**
   * @method isLoggedIn
   * @description Verifies if a user session token is present in local storage.
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('storage_jwt');
  }

  /**
   * @method logout
   * @description Clears active session footprints and drops the stored token.
   */
  logout(): void {
    localStorage.removeItem('storage_jwt');
  }
}
