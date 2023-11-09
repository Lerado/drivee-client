import { NgIf } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { loadingBarInteceptor } from './loading-bar.interceptor';
import { LoadingBarService } from './loading-bar.service';

@Component({
  selector: 'loading-bar',
  standalone: true,
  imports: [NgIf, MatProgressBarModule],
  providers: [HttpClientModule, LoadingBarService, { provide: HTTP_INTERCEPTORS, useValue: loadingBarInteceptor, multi: true }],
  templateUrl: './loading-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingBarComponent {

  loading = toSignal(this._loadingBarService.loading$)

  /**
   * Constructor
   */
  constructor(
    private readonly _loadingBarService: LoadingBarService
  ) { }
}
