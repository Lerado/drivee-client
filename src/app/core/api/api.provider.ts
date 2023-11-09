import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, Provider, importProvidersFrom } from '@angular/core';
import { apiInterceptor } from './api.interceptor';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiErrorHandler } from './utils/error-handler.service';

export const provideApi: () => Array<EnvironmentProviders | Provider> = () => [
  provideHttpClient(withInterceptors([apiInterceptor])),
  importProvidersFrom(MatSnackBarModule),
  ApiErrorHandler,
  {
    provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
    useValue: {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    }
  }
];
