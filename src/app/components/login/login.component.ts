import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BearerTokenService } from 'src/app/services/bearer-token.service';
import { ErrorService } from 'src/app/services/error.service';
import { LoginRequest } from './login-types';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading = false;

  formModel: LoginRequest = {
    email: '',
    password: '',
  };

  constructor(
    private http: HttpClient,
    private tokenService: BearerTokenService,
    private router: Router,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (token) {
      this.router.navigate(['menu']);
    }
  }

  login(): void {
    this.isLoading = true;
    this.http
      .post<HttpResponse<any>>('/login', this.formModel, {
        observe: 'response',
      })
      .subscribe({
        next: (resp) => {
          const headers = resp.headers;
          const token = headers.get('Authorization');
          this.tokenService.saveToken(token);
          this.router.navigate(['menu']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorService.showError('Login failed. Make sure your CAPS LOCK is down.');
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  isDisabled(): boolean {
    return (
      this.formModel.email === '' ||
      this.formModel.password === '' ||
      this.isLoading
    );
  }
}
