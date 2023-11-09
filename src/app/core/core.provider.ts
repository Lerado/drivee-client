import { APP_INITIALIZER, EnvironmentProviders, Provider } from "@angular/core"
import { provideApi } from "./api/api.provider";
import { provideAuthentication } from "./auth/auth.provider";
import { exhaustMap, of, map, catchError, tap } from "rxjs";
import { AuthService } from "./auth/auth.service";
import { UserService } from "./user/user.service";

const loadUserRoles = (authService: AuthService, userService: UserService) =>
  () => authService.check()
    .pipe(
      exhaustMap((authenticated) => {
        if (!authenticated) {
          return of([]);
        }
        return userService.get()
          .pipe(
            map(user => user.roles)
          )
      }),
      catchError(() => of([]))
    );

export const provideCore: () => Array<EnvironmentProviders | Provider> = () => [

  // Provide API rewrite and aliasing
  provideApi(),

  // Authentication and authorization
  provideAuthentication(),

  {
    provide: APP_INITIALIZER,
    useFactory: loadUserRoles,
    deps: [AuthService, UserService],
    multi: true
  },
];
