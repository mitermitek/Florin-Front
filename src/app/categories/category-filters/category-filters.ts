import { Component, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CategoryFiltersData } from '../category.data';

@Component({
  selector: 'app-category-filters',
  imports: [ReactiveFormsModule, InputIcon, IconField, InputTextModule],
  templateUrl: './category-filters.html',
  styleUrl: './category-filters.scss',
})
export class CategoryFilters implements OnInit {
  readonly filterChange = output<CategoryFiltersData>();

  form = new FormGroup({
    name: new FormControl(''),
  });

  ngOnInit(): void {
    this.form.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(filters => {
      this.filterChange.emit(filters as CategoryFiltersData);
    })
  }
}
