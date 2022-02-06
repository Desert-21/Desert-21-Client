import { FormGroup } from '@angular/forms';

export const ConfirmPasswordValidator = (formGroup: FormGroup) => {
  if (!formGroup) {
    return;
  }
  let control = formGroup?.controls['password'];
  let matchingControl = formGroup.controls['confirmPassword'];
  if (
    matchingControl?.errors &&
    !matchingControl?.errors?.confirmPasswordValidator
  ) {
    return;
  }
  if (control?.value !== matchingControl?.value) {
    matchingControl?.setErrors({ confirmPasswordValidator: true });
  } else {
    matchingControl?.setErrors(null);
  }
};
