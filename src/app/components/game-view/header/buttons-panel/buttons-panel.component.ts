import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ErrorService } from 'src/app/services/error.service';
import { GameIdService } from 'src/app/services/game-id.service';
import { ConfirmModalActionService } from 'src/app/services/rx-logic/shared/confirm-modal-action.service';
import { GameModalService } from 'src/app/services/rx-logic/shared/game-modal.service';

@Component({
  selector: 'app-buttons-panel',
  templateUrl: './buttons-panel.component.html',
  styleUrls: ['./buttons-panel.component.scss'],
})
export class ButtonsPanelComponent implements OnInit {
  constructor(
    private gameModalService: GameModalService,
    private http: HttpClient,
    private confirmActionService: ConfirmModalActionService,
    private gameIdService: GameIdService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {}

  onSurrenderClick(): void {
    this.confirmActionService.set({
      text: 'Are you sure you want to surrender?',
      action: () => {
        this.http
          .post(`/surrender/${this.gameIdService.getId()}`, null)
          .subscribe({
            error: () => {
              this.errorService.showError(
                'Could not surrender this game! It\'s already ended!'
              );
            },
          });
      },
    });
    this.gameModalService.openModal('CONFIRM');
  }
}
