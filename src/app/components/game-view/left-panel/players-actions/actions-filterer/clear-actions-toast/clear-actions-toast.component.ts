import { Component, OnInit } from '@angular/core';
import { ActionClearingNotificationService } from 'src/app/services/rx-logic/resolution-phase/action-clearing-notification.service';

@Component({
  selector: 'app-clear-actions-toast',
  templateUrl: './clear-actions-toast.component.html',
  styleUrls: ['./clear-actions-toast.component.scss'],
})
export class ClearActionsToastComponent implements OnInit {
  shouldShowToast = false;

  constructor(
    private actionClearingNotificationService: ActionClearingNotificationService
  ) {}

  ngOnInit(): void {
    this.actionClearingNotificationService
      .getStateUpdates()
      .subscribe(() => {
        this.shouldShowToast = true;
      });
  }

  close(): void {
    this.shouldShowToast = false;
  }
}
