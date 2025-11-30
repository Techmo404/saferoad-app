import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = getAuth();

  return new Promise<boolean>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("🔐 Usuario autenticado:", user.email);
        resolve(true);
      } else {
        console.log("⛔ Usuario NO autenticado, enviando al login...");
        router.navigate(['/login']);
        resolve(false);
      }
    });
  });
};
