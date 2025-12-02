// src/app/auth-guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { filter, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  console.log("⏳ Esperando validación de sesión...");

  return authService.currentUser$.pipe(
    filter((state) => state !== undefined), // ⏳ espera hasta que Firebase responda
    take(1)
  ).toPromise().then((user) => {

    if (user) {
      console.log("🔐 Acceso permitido:", user.email);
      return true;
    }

    console.log("⛔ No autenticado → Login");
    router.navigate(['/login']);
    return false;
  });
};
