import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ErrorService } from '../services/error.service';

@Injectable()
export class AuthorizationErrorInterceptor implements HttpInterceptor {
  errorCodes = [401, 403];

  constructor(private errorService: ErrorService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const isUnauthorizedIssue = this.errorCodes.includes(error.status);
        if (!isUnauthorizedIssue) {
          return throwError(() => error);
        }
        this.errorService.showError(
          'Your session has expired. Please login again!'
        );
        this.router.navigate(['login']);
        return EMPTY;
      })
    );
  }
}
