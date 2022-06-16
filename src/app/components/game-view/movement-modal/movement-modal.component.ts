import { Component, Input, OnInit } from '@angular/core';
import {
  ModalActionType,
  MovementModalAvailableActionsService,
} from 'src/app/services/rx-logic/movement-modal-available-actions.service';

@Component({
  selector: 'app-movement-modal',
  templateUrl: './movement-modal.component.html',
  styleUrls: ['./movement-modal.component.scss'],
})
export class MovementModalComponent implements OnInit {
  isAvailable: [boolean, boolean, boolean, boolean] = [
    false,
    false,
    false,
    false,
  ];
  currentActionType: ModalActionType = 'MOVE_UNITS';

  @Input() modal: any;

  constructor(
    private availableActionService: MovementModalAvailableActionsService
  ) {}

  ngOnInit(): void {
    this.availableActionService.getStateUpdates().subscribe((actions) => {
      const canMoveUnits = actions.includes('MOVE_UNITS');
      const canAttack = actions.includes('ATTACK');
      const canBombard = actions.includes('BOMBARD');
      const canFireRocket = actions.includes('FIRE_ROCKET');
      this.isAvailable = [canMoveUnits, canAttack, canBombard, canFireRocket];
      this.currentActionType = actions[0];
    });
    this.availableActionService.requestState();
  }

  selectActionType(actionType: ModalActionType): void {
    this.currentActionType = actionType;
  }
}
