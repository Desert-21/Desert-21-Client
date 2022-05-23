import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PlayersAction } from 'src/app/models/actions';
import { RequestableResource } from './requestable-resource';

@Injectable({
  providedIn: 'root'
})
export class CurrentActionsService implements RequestableResource<Array<PlayersAction<any>>> {

  currentActions: Array<PlayersAction<any>> = [];
  subject: Subject<Array<PlayersAction<any>>> = new Subject();

  constructor() { }

  requestState(): void {
    this.subject.next(this.currentActions);
  }

  getStateUpdates(): Observable<PlayersAction<any>[]> {
    return this.subject.asObservable();
  }

  pushAction(action: PlayersAction<any>): void {
    this.currentActions.push(action);
    this.requestState();
  }

  removeAction(action: PlayersAction<any>): void {
    this.currentActions = this.currentActions.filter(a => a !== action);
    this.requestState();
  }

  clearActions(): void {
    this.currentActions = [];
    this.requestState();
  }
}
