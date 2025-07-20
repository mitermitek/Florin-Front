import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { Toast } from './shared/toast/toast';
import { Loader } from './shared/loader/loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Toast, Loader],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
