import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
import { of, switchMap } from 'rxjs';

export const NoAuthGuard: CanActivateFn | CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.check()
    .pipe(
      switchMap((authenticated) => {
        if (authenticated) {
          router.navigateByUrl('');
          return of(false);
        }
        return of(true);
      })
    );
}
