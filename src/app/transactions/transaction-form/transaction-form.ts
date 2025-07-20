import { Component, inject, input, output, signal } from '@angular/core';
import {
  TransactionData,
  TransactionFormData,
  Type,
} from '../transaction.data';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CategoryData } from '../../categories/category.data';
import { CategoriesService } from '../../categories/categories.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css',
})
export class TransactionForm {
  readonly transaction = input<TransactionData | null>();
  readonly transactionSubmit = output<TransactionFormData>();

  private categoriesService = inject(CategoriesService);
  private toastService = inject(ToastService);

  categories = signal<CategoryData[]>([]);

  readonly Type = Type;
  readonly typeOptions = Object.values(Type);

  transactionForm = new FormGroup({
    type: new FormControl<string>(Type.EXPENSE, [Validators.required]),
    date: new FormControl<string>(this.getTodayDateString(), [
      Validators.required,
      this.dateFormatValidator(),
    ]),
    amount: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0.01),
      this.decimalValidator(),
    ]),
    description: new FormControl<string>('', [Validators.maxLength(255)]),
    category_id: new FormControl<number | null>(null, [Validators.required]),
  });

  ngOnInit(): void {
    this.loadCategories();

    const transaction = this.transaction();
    if (transaction) {
      this.transactionForm.patchValue({
        type: transaction.type,
        date: transaction.date, // Already in YYYY-MM-DD format
        amount: Number(transaction.amount),
        description: transaction.description,
        category_id: transaction.category.id,
      });
    }
  }

  private getTodayDateString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.transactionSubmit.emit(
        this.transactionForm.value as TransactionFormData
      );
      this.transactionForm.reset();
    } else {
      this.transactionForm.markAllAsTouched();
    }
  }

  private loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (response) => {
        this.categories.set(response);
        // Set first category as default if no transaction is being edited
        if (!this.transaction() && response.length > 0) {
          this.transactionForm.patchValue({
            category_id: response[0].id,
          });
        }
      },
      error: () => this.toastService.showError('Error loading categories!'),
    });
  }

  private dateFormatValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null; // Let required validator handle empty values
      }

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(control.value)) {
        return { invalidDateFormat: { value: control.value } };
      }

      // Additional check to ensure it's a valid date
      const date = new Date(control.value);
      const isValidDate = date instanceof Date && !isNaN(date.getTime());
      const matchesInput = date.toISOString().split('T')[0] === control.value;

      if (!isValidDate || !matchesInput) {
        return { invalidDate: { value: control.value } };
      }

      return null;
    };
  }

  private decimalValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value && control.value !== 0) {
        return null; // Let required validator handle empty values
      }

      const value = control.value.toString();
      const decimalRegex = /^\d+(\.\d{1,2})?$/;

      if (!decimalRegex.test(value)) {
        return { invalidDecimal: { value: control.value } };
      }

      return null;
    };
  }
}
