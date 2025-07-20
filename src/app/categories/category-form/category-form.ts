import { Component, input, output, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryData, CategoryFormData } from '../category.data';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm implements OnInit {
  readonly category = input<CategoryData | null>();
  readonly categorySubmit = output<CategoryFormData>();

  categoryForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(255),
    ]),
  });

  ngOnInit(): void {
    const category = this.category();
    if (category) {
      this.categoryForm.patchValue({
        name: category.name,
      });
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.categorySubmit.emit(this.categoryForm.value as CategoryFormData);
      this.categoryForm.reset();
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }
}
