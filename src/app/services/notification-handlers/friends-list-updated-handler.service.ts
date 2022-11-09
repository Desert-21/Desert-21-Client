import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { NotificationHandler } from 'src/app/models/notification-models';
import { FriendEntry } from 'src/app/models/profile-models.';
import { RequestableResource } from '../rx-logic/templates/requestable-resource';

@Injectable({
  providedIn: 'root',
})
export class FriendsListUpdatedHandlerService
  implements
    NotificationHandler<Array<FriendEntry>>,
    RequestableResource<Array<FriendEntry> | null>
{
  constructor() {}

  type = 'FRIENDS_LIST_UPDATED';

  subject: BehaviorSubject<Array<FriendEntry>> = new BehaviorSubject(null);

  handle(entries: FriendEntry[]): void {
    this.subject.next(entries);
  }

  requestState(): void {
    this.subject.next(this.subject.getValue());
  }

  getStateUpdates(): Observable<FriendEntry[]> {
    return this.subject.asObservable().pipe(filter((a) => a !== null));
  }
}
