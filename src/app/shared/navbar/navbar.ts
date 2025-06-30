import { Component, inject } from '@angular/core';
import { AuthService } from '../../authentication/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authService = inject(AuthService);

  displayMenu() {
    return this.authService.isAuthenticated();
  }
}
