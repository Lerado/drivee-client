import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoadingBarComponent } from '../loading-bar/loading-bar.component';
import { UserService } from 'app/core/user/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'main-layout',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, TitleCasePipe, DatePipe, LoadingBarComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {

  user = toSignal(this._userService.user$, { requireSync: true });

  currentYear = new Date().getFullYear();

  /**
   * Constructor
   */
  constructor(
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
    private readonly _router: Router
  ) { }

  // -------------------------------------------------------------------
  // @ Public methods
  // -------------------------------------------------------------------

  /**
   * Signs the user out
   */
  signOut(): void {
    this._authService.signOut();
    this._router.navigate(['/sign-in']);
  }
}
