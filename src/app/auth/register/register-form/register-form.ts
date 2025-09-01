import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { RegisterData } from '../../auth.data';
import { passwordMatchValidator } from './password-match.directive';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, MessageModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm {
  readonly registerSubmit = output<RegisterData>();

  form = new FormGroup(
    {
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator() }
  );

  onSubmit(): void {
    if (this.form.valid) {
      this.registerSubmit.emit(this.form.value as RegisterData);
      this.form.reset();
    } else {
      this.form.markAllAsTouched();
    }
  }
}
