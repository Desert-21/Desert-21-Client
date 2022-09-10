import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private sub = new Subject<string>();

  constructor() {}

  getErrorUpdates(): Observable<string> {
    return this.sub.asObservable();
  }

  showError(message: string): void {
    this.sub.next(message);
  }
}
