import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoriesService } from './categories.service';
import { CategoryData, CategoryFormData } from './category.data';
import { ToastService } from '../shared/toast/toast.service';
import { CategoryForm } from './category-form/category-form';

@Component({
  selector: 'app-categories',
  imports: [CategoryForm],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  private categoriesService = inject(CategoriesService);
  private toastService = inject(ToastService);

  categories = signal<CategoryData[]>([]);
  category = signal<CategoryData | undefined>(undefined);
  isModalOpen = signal<boolean>(false);
  isConfirmationModalOpen = signal<boolean>(false);

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

  confirmDeletion(): void {
    const category = this.category();

    if (category) {
      this.deleteCategory(category);
    } else {
      this.toastService.showError('No category selected!');
      this.closeConfirmationModal();
    }
  }

  openModal(category?: CategoryData): void {
    this.category.set(category);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.category.set(undefined);
    this.isModalOpen.set(false);
  }

  openConfirmationModal(category: CategoryData): void {
    this.category.set(category);
    this.isConfirmationModalOpen.set(true);
  }

  closeConfirmationModal(): void {
    this.category.set(undefined);
    this.isConfirmationModalOpen.set(false);
  }

  private loadCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (response) => this.categories.set(response),
      error: () => this.toastService.showError('Error loading categories!'),
    });
  }

  private createCategory(data: CategoryFormData): void {
    this.categoriesService.createCategory(data).subscribe({
      next: () => {
        this.toastService.showSuccess('Category created successfully!');
        this.closeModal();
        this.loadCategories();
      },
      error: () => this.toastService.showError('Error creating category!'),
    });
  }

  private updateCategory(category: CategoryData, data: CategoryFormData): void {
    this.categoriesService.updateCategory(category.id, data).subscribe({
      next: () => {
        this.toastService.showSuccess('Category updated successfully!');
        this.closeModal();
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
