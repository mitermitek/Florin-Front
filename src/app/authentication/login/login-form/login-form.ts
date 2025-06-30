import { Component, output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginFormData } from './login-form.data';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  readonly loginSubmit = output<LoginFormData>();

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formData: LoginFormData = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!,
      };

      this.loginSubmit.emit(formData);
      this.loginForm.reset();
    } else {
      console.error('login form is invalid');
    }
  }
}
