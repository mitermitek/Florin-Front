import { Component, inject, signal } from '@angular/core';
import { ToastService } from './toast.service';
import { CommonModule } from '@angular/common';
import { CircleCheckBigIcon, InfoIcon, LucideAngularModule, OctagonXIcon } from 'lucide-angular';

@Component({
  selector: 'app-toast',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  private toastService = inject(ToastService);

  toasts = this.toastService.toasts$;

  readonly InfoIcon = InfoIcon;
  readonly CircleCheckBigIcon = CircleCheckBigIcon;
  readonly OctagonXIcon = OctagonXIcon;
}
