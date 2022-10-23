import { Injectable } from '@angular/core';
import { NotificationHandler } from 'src/app/models/notification-models';
import { ToastsService } from '../rx-logic/shared/toasts.service';

@Injectable({
  providedIn: 'root',
})
export class DrawRejectedNotificationHandlerService
  implements NotificationHandler<string>
{
  constructor(private toastsService: ToastsService) {}

  type = 'DRAW_REJECTED';

  handle(arg: string): void {
    this.toastsService.add({
      theme: 'WARNING',
      description: 'Opponent has rejected your draw request!',
      title: 'Draw Rejected'
    });
  }
}
