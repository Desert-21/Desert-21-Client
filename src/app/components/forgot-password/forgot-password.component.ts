import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  isLoading = false;

  formModel = {
    email: '',
  };

  hasSucceeded = false;

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  ngOnInit(): void {}

  sendLink(): void {
    this.isLoading = true;
    this.http
      .post(`/password-reset/request/${this.formModel.email}`, null)
      .subscribe({
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

  isDisabled(): boolean {
    return this.isLoading || this.formModel.email.length < 1;
  }
}
