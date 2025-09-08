import { AsyncPipe } from '@angular/common';
import { Component, inject, signal, viewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import {
  BehaviorSubject,
  combineLatestWith,
  map,
  Observable,
  switchMap,
  tap
} from 'rxjs';
import { CategoriesService } from './categories.service';
import { CategoryFilters } from './category-filters/category-filters';
import { CategoryForm } from './category-form/category-form';
import { CategoryData, CategoryFiltersData, CreateUpdateCategoryData } from './category.data';

@Component({
  selector: 'app-categories',
  imports: [
    PanelModule,
    PaginatorModule,
    ButtonModule,
    AsyncPipe,
    Dialog,
    CategoryForm,
    CategoryFilters,
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  private categoriesService = inject(CategoriesService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private paginationState$ = new BehaviorSubject<PaginatorState>({ first: 0, rows: 10 });
  private filtersState$ = new BehaviorSubject<CategoryFiltersData>({});

  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  currentPage: number = 1;

  categories$: Observable<CategoryData[]> = this.paginationState$.pipe(
    combineLatestWith(this.filtersState$),
    switchMap(([pagination, filters]) =>
      this.categoriesService.getCategories(pagination.page, pagination.rows, filters)
    ),
    tap((response) => (this.totalRecords = response.total)),
    map((response) => response.items)
  );

  showDialog: boolean = false;
  selectedCategory = signal<CategoryData | null>(null);
  categoryFormRef = viewChild<CategoryForm>('categoryForm');

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.currentPage = this.first / this.rows + 1;

    this.paginationState$.next({
      first: this.first,
      rows: this.rows,
      page: this.currentPage,
    });
  }

  onCreate() {
    this.selectedCategory.set(null);
    this.showDialog = true;
  }

  onEdit(category: CategoryData) {
    this.selectedCategory.set(category);
    this.showDialog = true;
  }

  onDelete(category: CategoryData) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the category "${category.name}"?`,
      header: 'Delete category',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
        outlined: true,
      },
      accept: () => {
        this.categoriesService.deleteCategory(category.id).subscribe({
          next: () => {
            this.paginationState$.next(this.paginationState$.value);
            this.messageService.add({
              severity: 'success',
              summary: 'Category Deleted',
              detail: 'The category has been deleted successfully.',
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: err.statusText,
              detail: err.error.message,
            });
          },
        });
      },
    });
  }

  onDialogHide() {
    this.selectedCategory.set(null);
    this.showDialog = false;
  }

  onSave(categoryData: CreateUpdateCategoryData) {
    const category = this.selectedCategory();
    const action$ = category
      ? this.categoriesService.updateCategory(category.id, categoryData)
      : this.categoriesService.createCategory(categoryData);

    action$.subscribe({
      next: () => {
        this.paginationState$.next(this.paginationState$.value);
        this.onDialogHide();
        this.categoryFormRef()?.form.reset();
        this.messageService.add({
          severity: 'success',
          summary: category ? 'Category Updated' : 'Category Created',
          detail: `The category has been ${category ? 'updated' : 'created'} successfully.`,
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: err.statusText,
          detail: err.error.message,
        });
      },
    });
  }

  onFiltersChange(filters: CategoryFiltersData) {
    this.filtersState$.next(filters);
  }
}
