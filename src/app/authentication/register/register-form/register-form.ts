import { Component, output } from '@angular/core';
import { RegisterData } from '../../auth.data';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  readonly registerSubmit = output<RegisterData>();

  registerForm = new FormGroup(
    {
      first_name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(255),
      ]),
      last_name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(255),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      password_confirmation: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMatchValidator }
  );

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.registerSubmit.emit(this.registerForm.value as RegisterData);
      this.registerForm.reset();
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  private passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.get('password');
    const passwordConfirmation = control.get('password_confirmation');

    if (!password || !passwordConfirmation) {
      return null;
    }

    return password.value === passwordConfirmation.value
      ? null
      : { passwordMismatch: true };
  }
}
