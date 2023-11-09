import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { SignInDto, SignUpDto } from './auth.dto';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AuthenticationTokens } from './auth.types';

@Injectable()
export class AuthService {

  private _authenticated: boolean = false;

  /**
   * Constructor
   */
  constructor(
    private readonly _httpClient: HttpClient
  ) { }

  // -------------------------------------------------------------------
  // @ Accessors
  // -------------------------------------------------------------------

  /**
   * Getter and setter for accessToken
   */
  get accessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
  set accessToken(value: string) {
    localStorage.setItem('accessToken', value);
  }

  /**
   * Getter and setter for refreshToken
   */
  get refreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
  set refreshToken(value: string) {
    localStorage.setItem('refreshToken', value);
  }

  // -------------------------------------------------------------------
  // @ Public methods
  // -------------------------------------------------------------------

  /**
   * Sign in
   *
   * @param payload
   */
  signIn(payload: SignInDto): Observable<AuthenticationTokens> {
    return this._httpClient.post<AuthenticationTokens>('@api/oauth/login', payload)
      .pipe(
        tap(({ accessToken, refreshToken }) => {
          this._authenticated = true;
          this.accessToken = accessToken;
          this.refreshToken = refreshToken;
        })
      );
  }

  /**
   * Register a new user
   *
   * @param payload
   */
  signUp(payload: SignUpDto): Observable<unknown> {
    return this._httpClient.post<unknown>('@api/oauth/sign-up', payload);
  }

  /**
   * Authenticate using a refresh token
   */
  signInUsingToken(): Observable<AuthenticationTokens> {
    return this._httpClient.post<AuthenticationTokens>('@api/oauth/refresh', { refreshToken: this.refreshToken })
      .pipe(
        tap(({ accessToken, refreshToken }) => {
          this._authenticated = true;
          this.accessToken = accessToken;
          this.refreshToken = refreshToken;
        })
      );
  }

  /**
   * Signs user out
   */
  signOut(): Observable<boolean> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this._authenticated = false;
    return of(true);
  }

  /**
   * Check authentication status
   */
  check(): Observable<boolean> {

    if (this._authenticated) {
      return of(true);
    }

    if (!this.accessToken) {
      return of(false);
    }

    return this.signInUsingToken()
      .pipe(
        map(() => true),
        catchError(() => of(false))
      )
  }
}
