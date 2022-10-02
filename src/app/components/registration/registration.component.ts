import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorService } from 'src/app/services/error.service';
import { ConfirmPasswordValidator } from 'src/app/utils/confirm-password.validator';
import { Registration } from './registration-types';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private errorService: ErrorService
  ) {}

  requestModel: Registration = {
    nickname: '',
    email: '',
    password: '',
  };

  isLoading = false;
  isSucceeded = false;

  registerForm: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        nickname: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: ConfirmPasswordValidator }
    );
  }

  onRegister(): void {
    const v = this.registerForm.value;
    this.requestModel = {
      nickname: v.nickname,
      email: v.email,
      password: v.password,
    };
    this.isLoading = true;
    this.http.post('/registration', this.requestModel).subscribe({
      next: (resp) => {
        this.isSucceeded = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorService.showError(`Registration failed! ${err.error}`);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
