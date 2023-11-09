import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Observable, forkJoin } from "rxjs";
import { UserService } from "./core/user/user.service";

export const initialDataResolver: ResolveFn<unknown> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<unknown> => {

  const userService = inject(UserService);

  return forkJoin([
    userService.get()
  ]);
}
