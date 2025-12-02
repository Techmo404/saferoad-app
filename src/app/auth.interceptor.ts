
import { HttpInterceptorFn } from '@angular/common/http';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = getAuth();


  if (req.url.includes('/login') || req.url.includes('/register')) {
    return next(req);
  }


  const isBackend = req.url.startsWith('http://127.0.0.1:8000');
  if (!isBackend) return next(req);

  return from(
    new Promise<string | null>(resolve => {

      onAuthStateChanged(auth, async (user) => {
        if (!user) return resolve(null);
        resolve(await user.getIdToken());
      });
    })
  ).pipe(
    switchMap(token => {
      if (!token) {
        console.warn("⚠ Request SIN TOKEN → backend rechazará:", req.url);
        return next(req);
      }

      console.log("✅ Token agregado:", req.url);

      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });

      return next(cloned);
    })
  );
};
