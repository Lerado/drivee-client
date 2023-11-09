import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { User } from './user.types';

@Injectable({ providedIn: 'root' })
export class UserService {

  private readonly _user: ReplaySubject<User> = new ReplaySubject<User>(1);

  /**
   * Constructor
   */
  constructor(
    private readonly _httpClient: HttpClient
  ) { }

  // -------------------------------------------------------------------
  // @ Acessors
  // -------------------------------------------------------------------

  /**
   * Access user
   */
  get user$(): Observable<User> {
    return this._user.asObservable();
  }

  // -------------------------------------------------------------------
  // @ Public methods
  // -------------------------------------------------------------------

  /**
   * Get current user
   */
  get(): Observable<User> {
    return this._httpClient.get<User>('@api/oauth/authenticated').pipe(
      tap(user => this._user.next(user))
    );
  }
}
