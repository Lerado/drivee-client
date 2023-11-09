import { Component, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { finalize, switchMap, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './sign-up.component.html'
})
export class AuthSignUpComponent {

  signUpForm = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    password: ['', Validators.required],
  });

  loading = signal(false);

  /**
   * Constructor
   */
  constructor(
    private readonly _authService: AuthService,
    private readonly _formBuilder: NonNullableFormBuilder,
    private readonly _router: Router
  ) { }

  // -------------------------------------------------------------------
  // @ Public methods
  // -------------------------------------------------------------------

  /**
   * Registers the user
   */
  signUp(): void {

    if (this.signUpForm.invalid) return;

    this.loading.set(true);

    const { email: username, password } = this.signUpForm.getRawValue();

    this._authService.signUp(this.signUpForm.getRawValue())
      .pipe(
        switchMap(() => this._authService.signIn({ username, password })),
        tap(() => this._router.navigateByUrl('/')),
        finalize(() => this.loading.set(false))
      )
      .subscribe();
  }
}
