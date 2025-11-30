import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from './firebase-config';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const auth = getAuth(firebaseApp);

  const user = auth.currentUser;

  // ⚠ Bloquea acceso inmediato si no hay sesión
  if (!user) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
