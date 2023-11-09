import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingBarComponent } from '../loading-bar/loading-bar.component';

@Component({
  selector: 'auth-layout',
  standalone: true,
  imports: [RouterOutlet, LoadingBarComponent],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent {

}
