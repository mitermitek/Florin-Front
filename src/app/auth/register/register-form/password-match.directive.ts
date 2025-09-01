import { Directive, forwardRef } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}

@Directive({
  selector: '[appPasswordMatch]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PasswordMatchValidatorDirective),
      multi: true,
    },
  ],
})
export class PasswordMatchValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return passwordMatchValidator()(control);
  }
}
