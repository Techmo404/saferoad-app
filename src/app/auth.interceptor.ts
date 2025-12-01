    // src/app/auth.interceptor.ts
    import { HttpInterceptorFn } from '@angular/common/http';
    import { inject } from '@angular/core';
    import { AuthService } from './auth.service';
    import { from } from 'rxjs';
    import { switchMap } from 'rxjs/operators';

    export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    // Opcional: solo incluir token en requests a tu API
    const isBackendRequest =
        req.url.startsWith('http://127.0.0.1:8000') ||   // Backend local Django/FastAPI
        req.url.includes('your-deployed-domain.com');   // URL cuando esté en producción

    if (!isBackendRequest) {
        return next(req);
    }

    return from(authService.getIdToken()).pipe(
        switchMap((token) => {
        if (token) {
            req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
            });
        }
        return next(req);
        })
    );
    };
