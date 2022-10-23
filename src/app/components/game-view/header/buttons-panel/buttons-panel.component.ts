import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/services/error.service';
import { GameIdService } from 'src/app/services/game-id.service';
import { ConfirmModalActionService } from 'src/app/services/rx-logic/shared/confirm-modal-action.service';
import {
  DrawState,
  DrawStateService,
} from 'src/app/services/rx-logic/shared/draw-state.service';
import { GameModalService } from 'src/app/services/rx-logic/shared/game-modal.service';
import { IsDrawRequestedService } from 'src/app/services/rx-logic/shared/is-draw-requested.service';

@Component({
  selector: 'app-buttons-panel',
  templateUrl: './buttons-panel.component.html',
  styleUrls: ['./buttons-panel.component.scss'],
})
export class ButtonsPanelComponent implements OnInit {
  sub1: Subscription;

  drawState: DrawState = 'NONE';

  constructor(
    private gameModalService: GameModalService,
    private http: HttpClient,
    private confirmActionService: ConfirmModalActionService,
    private gameIdService: GameIdService,
    private errorService: ErrorService,
    private drawStateService: DrawStateService,
    private isDrawRequestedService: IsDrawRequestedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub1 = this.drawStateService.getStateUpdates().subscribe((state) => {
      this.drawState = state;
    });
    this.drawStateService.requestState();
  }

  onSurrenderClick(): void {
    this.confirmActionService.set({
      text: 'Are you sure you want to surrender?',
      action: () => {
        this.http
          .post(`/surrender/${this.gameIdService.getId()}`, null)
          .subscribe({
            error: () => {
              this.errorService.showError(
                "Could not surrender this game! It's already ended!"
              );
            },
          });
      },
    });
    this.gameModalService.openModal('CONFIRM');
  }

  onDrawClick(): void {
    this.confirmActionService.set({
      text: 'Are you sure you want to offer a draw?',
      action: () => {
        this.http
          .post(`/draw/${this.gameIdService.getId()}`, 'REQUEST')
          .subscribe({
            next: () => {
              this.isDrawRequestedService.set(true);
            },
            error: () => {
              this.errorService.showError('Cannot request draw too often!');
            },
          });
      },
    });
    this.gameModalService.openModal('CONFIRM');
  }

  onCancelDrawClick(): void {
    this.http.post(`/draw/${this.gameIdService.getId()}`, 'CANCEL').subscribe({
      next: () => {
        this.isDrawRequestedService.set(false);
      },
      error: () => {
        this.errorService.showError('Could not cancel the draw request!');
      },
    });
  }

  onBackToMenu(): void {
    this.router.navigate(['menu']);
  }
}
