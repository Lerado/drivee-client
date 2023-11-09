import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
import { tap } from 'rxjs';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.check()
    .pipe(
      tap((authenticated) => {
        if (!authenticated) {
          router.navigate(['/sign-in']);
        }
      })
    );
}
