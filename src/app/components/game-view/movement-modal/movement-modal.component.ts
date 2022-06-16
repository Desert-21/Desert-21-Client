import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CurrentActionsService } from 'src/app/services/rx-logic/current-actions.service';
import {
  ModalActionType,
  MovementModalAvailableActionsService,
} from 'src/app/services/rx-logic/movement-modal-available-actions.service';
import { MoveUnitsComponent } from './move-units/move-units.component';

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

  @ViewChild('moveUnits') moveUnitsComponent: MoveUnitsComponent;

  constructor(
    private availableActionService: MovementModalAvailableActionsService,
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

  onMoveUnitsConfirm(): void {
    this.moveUnitsComponent.onConfirm();
    this.modal.close('');
  }
}
