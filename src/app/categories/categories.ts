import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { CategoriesService } from './categories.service';
import {
  CategoriesPaginatedData,
  CategoryData,
  CategoryFiltersData,
  CategoryFormData,
} from './category.data';
import { ToastService } from '../shared/toast/toast.service';
import { CategoryForm } from './category-form/category-form';
import { Pagination } from '../shared/pagination/pagination';
import { Modal } from '../shared/modal/modal';
import {
  LucideAngularModule,
  PlusIcon,
  SquarePenIcon,
  Trash2Icon,
} from 'lucide-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoryFilters } from "./category-filters/category-filters";

@Component({
  selector: 'app-categories',
  imports: [CategoryForm, Pagination, Modal, LucideAngularModule, CategoryFilters],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  private categoriesService = inject(CategoriesService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  categories = signal<CategoriesPaginatedData | null>(null);
  category = signal<CategoryData | undefined>(undefined);
  isCreationModalOpen = signal<boolean>(false);
  isConfirmationModalOpen = signal<boolean>(false);
  currentFilters = signal<CategoryFiltersData>({});

  categoryFormRef = viewChild<CategoryForm>('categoryForm');

  readonly PlusIcon = PlusIcon;
  readonly SquarePenIcon = SquarePenIcon;
  readonly Trash2Icon = Trash2Icon;

  ngOnInit(): void {
    this.loadCategories();
  }

  onCategorySubmit(data: CategoryFormData): void {
    const category = this.category();

    if (category) {
      this.updateCategory(category, data);
    } else {
      this.createCategory(data);
    }
  }

  confirmCreation(): void {
    const formRef = this.categoryFormRef();
    if (formRef) {
      formRef.submitForm();
    }
  }

  confirmDeletion(): void {
    const category = this.category();

    if (category) {
      this.deleteCategory(category);
    } else {
      this.toastService.showError('No category selected!');
      this.closeConfirmationModal();
    }
  }

  openCreationModal(category?: CategoryData): void {
    this.category.set(category);
    this.isCreationModalOpen.set(true);
  }

  closeCreationModal(): void {
    this.category.set(undefined);
    this.isCreationModalOpen.set(false);
  }

  openConfirmationModal(category: CategoryData): void {
    this.category.set(category);
    this.isConfirmationModalOpen.set(true);
  }

  closeConfirmationModal(): void {
    this.category.set(undefined);
    this.isConfirmationModalOpen.set(false);
  }

  onPageChange(page: number) {
    this.loadCategories(page);
  }

  onFiltersChange(filters: CategoryFiltersData) {
    this.currentFilters.set(filters);
    this.loadCategories();
  }

  private loadCategories(page: number = 1) {
    this.categoriesService
      .getCategories(page, this.currentFilters())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.categories.set(response),
        error: () => this.toastService.showError('Error loading categories!'),
      });
  }

  private createCategory(data: CategoryFormData): void {
    this.categoriesService
      .createCategory(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Category created successfully!');
          this.closeCreationModal();
          this.loadCategories();
        },
        error: () => this.toastService.showError('Error creating category!'),
      });
  }

  private updateCategory(category: CategoryData, data: CategoryFormData): void {
    this.categoriesService
      .updateCategory(category.id, data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Category updated successfully!');
          this.closeCreationModal();
          this.loadCategories();
        },
        error: () => this.toastService.showError('Error updating category!'),
      });
  }

  private deleteCategory(category: CategoryData): void {
    this.categoriesService
      .deleteCategory(category.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Category deleted successfully!');
          this.closeConfirmationModal();
          this.loadCategories();
        },
        error: () => this.toastService.showError('Error deleting category!'),
      });
  }
}
