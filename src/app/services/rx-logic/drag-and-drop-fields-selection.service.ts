import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DirectedLocationPair } from 'src/app/models/game-utility-models';
import { RequestableResource } from './requestable-resource';

@Injectable({
  providedIn: 'root'
})
export class DragAndDropFieldsSelectionService implements RequestableResource<DirectedLocationPair | null> {

  constructor() { }

  private current: DirectedLocationPair | null = null;
  private subject = new Subject<DirectedLocationPair | null>();

  select(selection: DirectedLocationPair): void {
    this.current = selection;
    this.requestState();
  }

  unselect(): void {
    this.current = null;
    this.requestState();
  }

  requestState(): void {
    this.subject.next(this.current);
  }

  getStateUpdates(): Observable<DirectedLocationPair> {
    return this.subject.asObservable();
  }
}
