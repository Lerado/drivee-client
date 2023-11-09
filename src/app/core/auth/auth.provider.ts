import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, Provider } from '@angular/core';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

export const provideAuthentication: () => Array<EnvironmentProviders | Provider> = () => [
  AuthService,
  provideHttpClient(withInterceptors([authInterceptor]))
]
