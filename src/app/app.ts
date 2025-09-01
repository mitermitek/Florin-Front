import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './shared/menu/menu';
import { Footer } from './shared/footer/footer';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, Footer, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
