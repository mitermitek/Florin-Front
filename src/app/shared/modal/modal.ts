import { Component, input, output } from '@angular/core';
import { LucideAngularModule, XIcon } from 'lucide-angular';

@Component({
  selector: 'app-modal',
  imports: [LucideAngularModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  title = input<string>('');
  confirmText = input<string>('Confirm');
  cancelText = input<string>('Cancel');
  showFooter = input<boolean>(true);

  confirmed = output<void>();
  cancelled = output<void>();
  closed = output<void>();

  readonly XIcon = XIcon;

  close() {
    this.closed.emit();
  }

  confirm() {
    this.confirmed.emit();
  }

  cancel() {
    this.cancelled.emit();
  }
}
