import { Component, inject } from '@angular/core';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.css',
})
export class Loader {
  private loaderService = inject(LoaderService);

  isVisible = this.loaderService.isLoading;
}
