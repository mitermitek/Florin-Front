import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
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
