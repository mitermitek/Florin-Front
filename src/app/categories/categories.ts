import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { CategoriesService } from './categories.service';
import {
  CategoriesPaginatedData,
  CategoryData,
  CategoryFormData,
} from './category.data';
import { ToastService } from '../shared/toast/toast.service';
import { CategoryForm } from './category-form/category-form';
import { Pagination } from '../shared/pagination/pagination';
import { Modal } from '../shared/modal/modal';

@Component({
  selector: 'app-categories',
  imports: [CategoryForm, Pagination, Modal],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  private categoriesService = inject(CategoriesService);
  private toastService = inject(ToastService);

  categories = signal<CategoriesPaginatedData | null>(null);
  category = signal<CategoryData | undefined>(undefined);
  isCreationModalOpen = signal<boolean>(false);
  isConfirmationModalOpen = signal<boolean>(false);

  categoryFormRef = viewChild<CategoryForm>('categoryForm');

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

  private loadCategories(page: number = 1) {
    this.categoriesService.getCategories(page).subscribe({
      next: (response) => this.categories.set(response),
      error: () => this.toastService.showError('Error loading categories!'),
    });
  }

  private createCategory(data: CategoryFormData): void {
    this.categoriesService.createCategory(data).subscribe({
      next: () => {
        this.toastService.showSuccess('Category created successfully!');
        this.closeCreationModal();
        this.loadCategories();
      },
      error: () => this.toastService.showError('Error creating category!'),
    });
  }

  private updateCategory(category: CategoryData, data: CategoryFormData): void {
    this.categoriesService.updateCategory(category.id, data).subscribe({
      next: () => {
        this.toastService.showSuccess('Category updated successfully!');
        this.closeCreationModal();
        this.loadCategories();
      },
      error: () => this.toastService.showError('Error updating category!'),
    });
  }

  private deleteCategory(category: CategoryData): void {
    this.categoriesService.deleteCategory(category.id).subscribe({
      next: () => {
        this.toastService.showSuccess('Category deleted successfully!');
        this.closeConfirmationModal();
        this.loadCategories();
      },
      error: () => this.toastService.showError('Error deleting category!'),
    });
  }
}
