import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordsMustMatchValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get('password') as FormControl
    const confirmPassword = formGroup.get('confirmPassword') as FormControl

    return password.value === confirmPassword.value ? null : {passwordsMustMatch: true}
}

