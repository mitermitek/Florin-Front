import { Component, inject, signal } from '@angular/core';
import { TransactionsService } from './transactions.service';
import { ToastService } from '../shared/toast/toast.service';
import { TransactionData, TransactionFormData, Type } from './transaction.data';
import { TransactionForm } from './transaction-form/transaction-form';

@Component({
  selector: 'app-transactions',
  imports: [TransactionForm],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class Transactions {
  private transactionsService = inject(TransactionsService);
  private toastService = inject(ToastService);

  transactions = signal<TransactionData[]>([]);
  transaction = signal<TransactionData | undefined>(undefined);
  isModalOpen = signal<boolean>(false);
  isConfirmationModalOpen = signal<boolean>(false);

  Type = Type;

  ngOnInit(): void {
    this.loadTransactions();
  }

  onTransactionSubmit(data: TransactionFormData): void {
    const transaction = this.transaction();

    if (transaction) {
      this.updateTransaction(transaction, data);
    } else {
      this.createTransaction(data);
    }
  }

  confirmDeletion(): void {
    const transaction = this.transaction();

    if (transaction) {
      this.deleteTransaction(transaction);
    } else {
      this.toastService.showError('No transaction selected!');
      this.closeConfirmationModal();
    }
  }

  openModal(transaction?: TransactionData): void {
    this.transaction.set(transaction);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.transaction.set(undefined);
    this.isModalOpen.set(false);
  }

  openConfirmationModal(transaction: TransactionData): void {
    this.transaction.set(transaction);
    this.isConfirmationModalOpen.set(true);
  }

  closeConfirmationModal(): void {
    this.transaction.set(undefined);
    this.isConfirmationModalOpen.set(false);
  }

  private loadTransactions() {
    this.transactionsService.getTransactions().subscribe({
      next: (response) => this.transactions.set(response),
      error: () => this.toastService.showError('Error loading transactions!'),
    });
  }

  private createTransaction(data: TransactionFormData): void {
    this.transactionsService.createTransaction(data).subscribe({
      next: () => {
        this.toastService.showSuccess('Transaction created successfully!');
        this.closeModal();
        this.loadTransactions();
      },
      error: () => this.toastService.showError('Error creating transaction!'),
    });
  }

  private updateTransaction(transaction: TransactionData, data: TransactionFormData): void {
    this.transactionsService.updateTransaction(transaction.id, data).subscribe({
      next: () => {
        this.toastService.showSuccess('Transaction updated successfully!');
        this.closeModal();
        this.loadTransactions();
      },
      error: () => this.toastService.showError('Error updating transaction!'),
    });
  }

  private deleteTransaction(transaction: TransactionData): void {
    this.transactionsService.deleteTransaction(transaction.id).subscribe({
      next: () => {
        this.toastService.showSuccess('Transaction deleted successfully!');
        this.closeConfirmationModal();
        this.loadTransactions();
      },
      error: () => this.toastService.showError('Error deleting transaction!'),
    });
  }
}
