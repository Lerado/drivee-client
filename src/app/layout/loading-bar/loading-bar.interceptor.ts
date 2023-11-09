import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { LoadingBarService } from './loading-bar.service';

export const loadingBarInteceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const loadingBarService = inject(LoadingBarService);
  loadingBarService.loading = true;
  return next(request).pipe(
    finalize(() => loadingBarService.loading = false)
  );
}
