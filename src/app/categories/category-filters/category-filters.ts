import { Component, DestroyRef, inject, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChevronDownIcon, ChevronUpIcon, LucideAngularModule } from 'lucide-angular';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CategoryFiltersData } from '../category.data';

@Component({
  selector: 'app-category-filters',
  imports: [ReactiveFormsModule, LucideAngularModule],
  templateUrl: './category-filters.html',
  styleUrl: './category-filters.css',
})
export class CategoryFilters implements OnInit {
  private destroyRef = inject(DestroyRef);

  filtersChange = output<CategoryFiltersData>();

  categoryFiltersForm = new FormGroup({
    name: new FormControl<string>('', [
      Validators.minLength(2),
      Validators.maxLength(255),
    ]),
  });
  isFiltersDisplayed = false;

  readonly ChevronDownIcon = ChevronDownIcon;
  readonly ChevronUpIcon = ChevronUpIcon;

  ngOnInit(): void {
    this.categoryFiltersForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((values) => {
        if (this.categoryFiltersForm.valid) {
          const filters: CategoryFiltersData = {};

          if (values.name) {
            filters.name = values.name.trim();
          }

          this.filtersChange.emit(filters);
        }
      });
  }

  showFilters(): void {
    this.isFiltersDisplayed = !this.isFiltersDisplayed;
  }
}
