import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ErrorService } from 'src/app/services/error.service';
import { ConfirmPasswordValidator } from 'src/app/utils/confirm-password.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  private requestTemplate = {
    linkId: '',
    linkCode: '',
    email: '',
  };

  hasSucceeded = false;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private errorService: ErrorService
  ) {}

  resetPasswordForm: FormGroup;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.requestTemplate = params as any;
    });

    this.resetPasswordForm = this.fb.group(
      {
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

  onSubmit(): void {
    this.isLoading = true;
    const password = this.resetPasswordForm.value.password;
    const model = {
      ...this.requestTemplate,
      password,
    };
    this.http.post('/password-reset/execute', model).subscribe({
      next: () => {
        this.isLoading = false;
        this.hasSucceeded = true;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorService.showError(err.error);
      },
    });
  }
}
