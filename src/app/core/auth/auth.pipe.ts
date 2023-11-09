import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * Add authorization token to any string (commonly a URL)
 */
@Pipe({
  name: 'auth',
  standalone: true
})
export class AuthPipe implements PipeTransform {

  /**
   * Constructor
   */
  constructor(
    private readonly _authService: AuthService
  ) { }

  /**
   * Transform
   *
   * @param value
   * @param args
   */
  transform(value: any, ...args: any[]): any {

    if (typeof value !== 'string') return value;

    const accessToken = this._authService.accessToken;

    if (!accessToken) return value;

    const searchParams = new URLSearchParams({ accessToken: `Bearer ${accessToken}` });
    let url: URL;
    if (value.includes('?')) {
      url = new URL(`${value}&${searchParams.toString()}`);
    }
    else {
      url = new URL(`${value}?${searchParams.toString()}`);
    }

    return url.toString();
  }
}
