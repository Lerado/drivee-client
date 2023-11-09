import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { NoAuthGuard } from './core/auth/guards/noAuth.guard';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { initialDataResolver } from './app.resolver';

export const routes: Routes = [

  { path: '', pathMatch: 'full', redirectTo: '/home' },

  // Routes for guests
  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: AuthLayoutComponent,
    children: [
      { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes') },
      { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes') }
    ]
  },

  // Routes for authenticated users
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: MainLayoutComponent,
    resolve: {
      initialData: initialDataResolver
    },
    children: [
      { path: 'home', loadChildren: () => import('app/modules/home/home.routes') }
    ]
  }
];
