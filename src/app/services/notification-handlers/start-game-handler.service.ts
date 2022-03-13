import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NotificationHandler, StartGameNotification } from 'src/app/models/notification-models';

@Injectable({
  providedIn: 'root'
})
export class StartGameHandlerService implements NotificationHandler<StartGameNotification> {

  constructor() { }

  type: string = 'START_GAME';

  startGameSub = new Subject<string>();

  handle(arg: StartGameNotification): void {
    this.startGameSub.next(arg.gameId);
  }

  getStartGameUpdates(): Observable<string> {
    return this.startGameSub.asObservable();
  }
}
