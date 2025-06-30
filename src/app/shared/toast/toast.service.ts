import { Injectable, signal } from '@angular/core';
import { ToastData } from './toast.data';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts = signal<ToastData[]>([]);

  readonly toasts$ = this.toasts.asReadonly();

  showInfo(message: string, duration?: number): void {
    this.addToast({ message, type: 'info', duration });
  }

  showSuccess(message: string, duration?: number): void {
    this.addToast({ message, type: 'success', duration });
  }

  showError(message: string, duration?: number): void {
    this.addToast({ message, type: 'error', duration });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private addToast(toast: Omit<ToastData, 'id'>): void {
    const newToast: ToastData = {
      ...toast,
      id: this.generateId(),
      duration: toast.duration ?? 5000,
    };

    this.toasts.update((current) => [...current, newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => this.removeToast(newToast.id), newToast.duration);
    }
  }

  private removeToast(id: string): void {
    this.toasts.update((current) => current.filter((toast) => toast.id !== id));
  }
}
