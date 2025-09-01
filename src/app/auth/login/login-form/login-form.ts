import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { LoginData } from '../../auth.data';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, MessageModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  readonly loginSubmit = output<LoginData>();

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.loginSubmit.emit(this.form.value as LoginData);
      this.form.reset();
    } else {
      this.form.markAllAsTouched();
    }
  }
}
