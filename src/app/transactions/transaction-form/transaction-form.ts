import {
  Component,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
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
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private destroyRef = inject(DestroyRef);

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
    category_name: new FormControl<string>('', [Validators.required]),
  });

  ngOnInit(): void {
    this.searchCategories();

    const transaction = this.transaction();
    if (transaction) {
      this.transactionForm.patchValue({
        type: transaction.type,
        date: transaction.date, // Already in YYYY-MM-DD format
        amount: Number(transaction.amount),
        description: transaction.description,
        category_id: transaction.category.id,
        category_name: transaction.category.name,
      });
    }

    // Listen to category_name changes with debounce for filtering
    this.transactionForm
      .get('category_name')
      ?.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((categoryName) => {
        if (categoryName) {
          // Filter categories based on input without showing loader
          this.searchCategories(1, categoryName);

          // Update category_id based on exact match
          const category = this.categories().find(
            (cat) => cat.name === categoryName
          );
          if (category) {
            this.transactionForm
              .get('category_id')
              ?.setValue(category.id, { emitEvent: false });
          } else {
            this.transactionForm
              .get('category_id')
              ?.setValue(null, { emitEvent: false });
          }
        } else {
          // Load first page of categories when input is empty
          this.searchCategories();
          this.transactionForm
            .get('category_id')
            ?.setValue(null, { emitEvent: false });
        }
      });
  }

  private getTodayDateString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      // Remove category_name from the submitted data, keep only category_id
      const { category_name, ...transactionData } = formValue;
      this.transactionSubmit.emit(transactionData as TransactionFormData);
      this.transactionForm.reset();
    } else {
      this.transactionForm.markAllAsTouched();
    }
  }

  isValid(): boolean {
    return this.transactionForm.valid;
  }

  submitForm(): void {
    this.onSubmit();
  }

  private searchCategories(page: number = 1, name?: string): void {
    this.categoriesService
      .searchCategories(page, name)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.categories.set(response.data);
        },
        error: () => this.toastService.showError('Error searching categories!'),
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
