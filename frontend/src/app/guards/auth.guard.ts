import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * @function authGuard
 * @description Secures routing pipelines by validating the presence of access tokens before granting entry to dashboards.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // 1. Verify if our auth process stored a valid JWT token string using the correct matching key
  const token = localStorage.getItem('storage_jwt');

  if (token) {
    // Token is present, let the user proceed to the dashboard!
    return true;
  }

  // 2. Token is missing! Block access and redirect them to the login screen
  router.navigate(['/login']);
  return false;
};
