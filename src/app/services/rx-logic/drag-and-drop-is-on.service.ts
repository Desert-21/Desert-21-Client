import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RequestableResource } from './requestable-resource';

@Injectable({
  providedIn: 'root'
})
export class DragAndDropIsOnService implements RequestableResource<boolean> {

  constructor() { }

  private current = false;
  private subject = new Subject<boolean>();

  setIsOn(isOn: boolean): void {
    this.current = isOn;
    this.requestState();
  }

  requestState(): void {
    this.subject.next(this.current);
  }

  getStateUpdates(): Observable<boolean> {
    return this.subject.asObservable();
  }
}
