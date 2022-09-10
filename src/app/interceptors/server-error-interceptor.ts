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
export class ServerErrorInterceptor implements HttpInterceptor {
  errorCode = 500;

  constructor(private errorService: ErrorService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const isServerError = this.errorCode === error.status;
        if (!isServerError) {
          return throwError(() => error);
        }
        this.errorService.showError(
          'Bad news! Something bad happened to the server. Please try again to do whatever you were doing and if it still doesn\'t work, contact me!'
        );
        return EMPTY;
      })
    );
  }
}
