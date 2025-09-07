import { Component, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CategoryData, CreateUpdateCategoryData } from '../category.data';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, MessageModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss',
})
export class CategoryForm implements OnInit {
  readonly categorySubmit = output<CreateUpdateCategoryData>();
  readonly category = input<CategoryData | null>();

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
  });

  ngOnInit(): void {
    const category = this.category();

    if (category) {
      this.form.patchValue({
        name: category.name,
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.categorySubmit.emit(this.form.value as CreateUpdateCategoryData);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
