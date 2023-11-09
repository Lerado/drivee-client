import { inject } from '@angular/core';
import { HttpEvent, HttpRequest, HttpInterceptorFn, HttpHandlerFn, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {

  const authService = inject(AuthService);

  let newRequest = req;

  /**
   * We are trying to intercept all the requests
   * and add Authorization header if a JWT token is found in the current context
   */
  if (authService.accessToken) {
    newRequest = newRequest.clone({
      headers: new HttpHeaders({
        Authorization: `Bearer ${authService.accessToken}`
      })
    });

    // In case of 401 error response, attempt a token refresh then retry the original request
    return next(newRequest).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return authService.signInUsingToken()
            .pipe(
              switchMap(() => next(newRequest.clone({
                headers: new HttpHeaders({
                  Authorization: `Bearer ${authService.accessToken}`
                })
              })))
            );
        }
        return throwError(() => error);
      })
    )
  }

  return next(newRequest);
}
