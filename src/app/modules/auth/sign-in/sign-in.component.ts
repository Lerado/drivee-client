import { Component, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { ApiErrorResponse } from 'app/core/api/api.types';
import { ApiErrorHandler } from 'app/core/api/utils/error-handler.service';
import { AuthService } from 'app/core/auth/auth.service';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  templateUrl: 'sign-in.component.html'
})
export class AuthSignInComponent {

  signInForm = this._formBuilder.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loading = signal(false);

  /**
   * Constructor
   */
  constructor(
    private readonly _authService: AuthService,
    private readonly _formBuilder: NonNullableFormBuilder,
    private readonly _errorHandler: ApiErrorHandler,
    private readonly _router: Router
  ) { }

  // -------------------------------------------------------------------
  // @ Public methods
  // -------------------------------------------------------------------

  /**
   * Sign the user in
   */
  signIn(): void {

    if (this.signInForm.invalid) return;

    this.loading.set(true);

    this._authService.signIn(this.signInForm.getRawValue())
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: () => this._router.navigate(['/']),
        error: (error: ApiErrorResponse) => this._errorHandler.handle(error)
      });
  }
}
