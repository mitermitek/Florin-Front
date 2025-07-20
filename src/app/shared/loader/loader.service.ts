import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loadingCount = signal(0);

  isLoading = this.loadingCount.asReadonly();

  show(): void {
    this.loadingCount.update((count) => count + 1);
  }

  hide(): void {
    this.loadingCount.update((count) => Math.max(0, count - 1));
  }

  get isVisible(): boolean {
    return this.loadingCount() > 0;
  }
}
