import {
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { TransactionsService } from './transactions.service';
import { ToastService } from '../shared/toast/toast.service';
import {
  TransactionData,
  TransactionFormData,
  TransactionsPaginatedData,
  Type,
} from './transaction.data';
import { TransactionForm } from './transaction-form/transaction-form';
import { Pagination } from '../shared/pagination/pagination';
import { Modal } from '../shared/modal/modal';
import {
  LucideAngularModule,
  PlusIcon,
  SquarePenIcon,
  Trash2Icon,
} from 'lucide-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-transactions',
  imports: [TransactionForm, Pagination, Modal, LucideAngularModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions {
  private transactionsService = inject(TransactionsService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  transactions = signal<TransactionsPaginatedData | null>(null);
  transaction = signal<TransactionData | undefined>(undefined);
  isCreationModalOpen = signal<boolean>(false);
  isConfirmationModalOpen = signal<boolean>(false);

  transactionFormRef = viewChild<TransactionForm>('transactionForm');

  Type = Type;

  readonly PlusIcon = PlusIcon;
  readonly SquarePenIcon = SquarePenIcon;
  readonly Trash2Icon = Trash2Icon;

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

  confirmCreation(): void {
    const formRef = this.transactionFormRef();
    if (formRef) {
      formRef.submitForm();
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

  openCreationModal(transaction?: TransactionData): void {
    this.transaction.set(transaction);
    this.isCreationModalOpen.set(true);
  }

  closeCreationModal(): void {
    this.transaction.set(undefined);
    this.isCreationModalOpen.set(false);
  }

  openConfirmationModal(transaction: TransactionData): void {
    this.transaction.set(transaction);
    this.isConfirmationModalOpen.set(true);
  }

  closeConfirmationModal(): void {
    this.transaction.set(undefined);
    this.isConfirmationModalOpen.set(false);
  }

  onPageChange(page: number) {
    this.loadTransactions(page);
  }

  private loadTransactions(page: number = 1) {
    this.transactionsService
      .getTransactions(page)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.transactions.set(response),
        error: () => this.toastService.showError('Error loading transactions!'),
      });
  }

  private createTransaction(data: TransactionFormData): void {
    this.transactionsService
      .createTransaction(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Transaction created successfully!');
          this.closeCreationModal();
          this.loadTransactions();
        },
        error: () => this.toastService.showError('Error creating transaction!'),
      });
  }

  private updateTransaction(
    transaction: TransactionData,
    data: TransactionFormData
  ): void {
    this.transactionsService
      .updateTransaction(transaction.id, data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Transaction updated successfully!');
          this.closeCreationModal();
          this.loadTransactions();
        },
        error: () => this.toastService.showError('Error updating transaction!'),
      });
  }

  private deleteTransaction(transaction: TransactionData): void {
    this.transactionsService
      .deleteTransaction(transaction.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Transaction deleted successfully!');
          this.closeConfirmationModal();
          this.loadTransactions();
        },
        error: () => this.toastService.showError('Error deleting transaction!'),
      });
  }
}
