import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../services/error.service';

@Injectable()
export class ConnectivityErrorInterceptor implements HttpInterceptor {

  constructor(private errorService: ErrorService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const isConnectivityIssue = error.status === 0;
        if (!isConnectivityIssue) {
          return throwError(() => error);
        }
        this.errorService.showError(
          'Could not connected with server. It probably means that something is wrong with your Internet connection. Come back when you have fixed the issue!'
        );
        return EMPTY;
      })
    );
  }
}
