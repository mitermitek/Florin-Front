import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './authentication/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private authService = inject(AuthService);

  displayMenu() {
    return this.authService.isAuthenticated();
  }
}
