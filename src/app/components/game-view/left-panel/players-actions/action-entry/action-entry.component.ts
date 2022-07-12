import { Component, Input, OnInit } from '@angular/core';
import { PlayersAction } from 'src/app/models/actions';
import { CurrentActionsService } from 'src/app/services/rx-logic/shared/current-actions.service';

@Component({
  selector: 'app-action-entry',
  templateUrl: './action-entry.component.html',
  styleUrls: ['./action-entry.component.scss'],
})
export class ActionEntryComponent implements OnInit {
  @Input()
  action: PlayersAction<any>;

  constructor(private currentActionsService: CurrentActionsService) {}

  ngOnInit(): void {}

  getActionHeader(): string {
    const type = this.action.getType();
    switch (type) {
      case 'UPGRADE':
        return 'Upgrade Building';
      case 'ATTACK':
        return 'Attack';
      case 'MOVE_UNITS':
        return 'Move Units';
      case 'TRAIN':
        return 'Train Units';
      case 'LAB_EVENT':
        return 'Lab Upgrade';
      case 'FIRE_ROCKET':
        return 'Rocket Strike';
      default:
        return 'Unknown';
    }
  }

  removeFromActionsList(): void {
    this.currentActionsService.removeAction(this.action);
  }
}
