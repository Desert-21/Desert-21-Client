import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RequestableResource } from '../templates/requestable-resource';

export type ModalType =
  | 'MOVEMENT'
  | 'GAME_END'
  | 'LAB'
  | 'RESOLUTION'
  | 'CONFIRM'
  | 'ACCEPT'
  | 'NO_ACTIONS';

@Injectable({
  providedIn: 'root',
})
export class GameModalService implements RequestableResource<ModalType> {
  constructor() {}

  private sub = new Subject<ModalType>();

  requestState(): void {
    // ignore
  }

  getStateUpdates(): Observable<ModalType> {
    return this.sub.asObservable();
  }

  openModal(type: ModalType): void {
    this.sub.next(type);
  }
}
