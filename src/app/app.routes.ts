import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './auth-guard';

export const routes: Routes = [

  // 🔹 Redirige al usuario al login si entra a "/"
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // 🔹 Página de login (solo accesible si NO está logueado)
  {
    path: 'login',
    component: Login
  },

  // 🔹 Dashboard protegido por el authGuard
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },

  // 🔹 Manejo de rutas no existentes
  {
    path: '**',
    redirectTo: 'login'
  }
];
