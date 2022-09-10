import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  retryDelay = 500;
  retryMaxAttempts = 5;
  errorCodesToIgnore = [401, 403, 406, 500];

  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(this.retryAfterDelay());
  }

  retryAfterDelay(): any {
    return retryWhen((errors) => {
      return errors.pipe(
        mergeMap((err, count) => {
          // throw error when we've retried ${retryMaxAttempts} number of times and still get an error
          if (
            count === this.retryMaxAttempts ||
            this.errorCodesToIgnore.includes(err.status)
          ) {
            return throwError(() => err);
          }
          return of(err).pipe(
            mergeMap(() => timer(this.retryDelay))
          );
        })
      );
    });
  }
}
