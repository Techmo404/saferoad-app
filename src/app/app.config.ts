import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { browserLocalPersistence } from 'firebase/auth';

import { firebaseConfig } from './firebase-config';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideFirebaseApp(() => initializeApp(firebaseConfig)),

    provideAuth(() => {
      const auth = getAuth();
      auth.setPersistence(browserLocalPersistence); // 🔥 CORRECTO
      return auth;
    }),

    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
