import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './auth-guard';
import { Register } from './pages/register/register';
import { History } from './pages/history/history';


export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register     
  },
  
  {
    path: 'history',
    component: History
  },


  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },


  {
    path: '**',
    redirectTo: 'login'
  }
];
