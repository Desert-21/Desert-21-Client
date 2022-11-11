import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { NotificationHandler } from 'src/app/models/notification-models';
import { InvitationInfo } from '../rx-logic/menu/player-invited.service';
import { ToastsService } from '../rx-logic/shared/toasts.service';
import { GameInvitationNotification } from './game-invitation-received-handler.service';

@Injectable({
  providedIn: 'root',
})
export class GameInvitationCancelledHandlerService
  implements NotificationHandler<GameInvitationNotification>
{
  constructor(private toastsService: ToastsService, private modalService: NgbModal) {}

  type = 'GAME_INVITATION_CANCELLED';

  num = 0;

  private subject = new Subject<number>();

  handle(arg: GameInvitationNotification): void {
    this.num = this.num + 1;
    this.subject.next(this.num);
    this.toastsService.add({
      theme: 'WARNING',
      title: 'Invitation Cancelled',
      description: `Player ${arg.playersNickname} cancelled your invitation to the game.`,
    });
  }

  getCancellationSignals(): Observable<number> {
    return this.subject.asObservable();
  }
}
