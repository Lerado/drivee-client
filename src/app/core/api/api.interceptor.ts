import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiAlias, ApiUrl } from './api.constants';
import { ApiErrorResponse } from './api.types';

export const apiInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {

  let newRequest = req;

  /**
   * We are trying to intercept all the requests made with the alias `@api`
   * and replace the alias with the real url base
   */
  if (newRequest.url.startsWith(`${ApiAlias}/`)) {
    newRequest = newRequest.clone({
      url: newRequest.url.replace(`${ApiAlias}`, ApiUrl)
    });

    return next(newRequest).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          return throwError(() => error.error as ApiErrorResponse)
        }
        return throwError(() => error);
      })
    );
  }

  return next(newRequest);
}
