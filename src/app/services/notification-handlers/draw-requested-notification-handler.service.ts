import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationHandler } from 'src/app/models/notification-models';
import { ErrorService } from '../error.service';
import { GameIdService } from '../game-id.service';
import { AcceptModalActionService } from '../rx-logic/shared/accept-modal-action.service';
import { ConfirmModalActionService } from '../rx-logic/shared/confirm-modal-action.service';
import { GameModalService } from '../rx-logic/shared/game-modal.service';
import {
  ToastEntry,
  ToastRequest,
  ToastsService,
} from '../rx-logic/shared/toasts.service';

@Injectable({
  providedIn: 'root',
})
export class DrawRequestedNotificationHandlerService
  implements NotificationHandler<string>
{
  constructor(
    private gameModalService: GameModalService,
    private acceptActionService: AcceptModalActionService,
    private http: HttpClient,
    private gameIdService: GameIdService,
    private toastsService: ToastsService
  ) {}

  type = 'DRAW_REQUESTED';

  private getToastEntry(message: string): ToastRequest {
    return {
      title: 'Draw Cancelled',
      description: message,
      theme: 'DANGER',
    };
  }

  handle(arg: string): void {
    this.acceptActionService.set({
      text: 'Opponent offers you a draw! Will you accept?',
      onAccept: () => {
        this.http
          .post(`/draw/${this.gameIdService.getId()}`, 'ACCEPT')
          .subscribe({
            error: () => {
              this.toastsService.add(
                this.getToastEntry(
                  'Could not accept the draw! Opponent must have cancelled the request!'
                )
              );
            },
          });
      },
      onReject: () => {
        this.http
          .post(`/draw/${this.gameIdService.getId()}`, 'REJECT')
          .subscribe({
            error: () => {
              this.toastsService.add(
                this.getToastEntry(
                  'Could not reject the draw! Opponent must have cancelled the request!'
                )
              );
            },
          });
      },
    });
    this.gameModalService.openModal('ACCEPT');
  }
}
