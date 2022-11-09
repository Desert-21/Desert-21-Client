import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RequestableResource } from '../templates/requestable-resource';

export type FriendsStatus = 'ACTIVE' | 'PLAYING' | 'INACTIVE';

@Injectable({
  providedIn: 'root',
})
export class FriendsActivityService
  implements RequestableResource<Map<string, FriendsStatus>>
{
  constructor() {}

  private subject = new BehaviorSubject<Map<string, FriendsStatus>>(new Map());

  put(id: string, status: FriendsStatus): void {
    const currentMap = this.subject.getValue();
    currentMap.set(id, status);
    this.subject.next(currentMap);
  }

  requestState(): void {
    this.subject.next(this.subject.getValue());
  }

  getStateUpdates(): Observable<Map<string, FriendsStatus>> {
    return this.subject.asObservable();
  }
}
