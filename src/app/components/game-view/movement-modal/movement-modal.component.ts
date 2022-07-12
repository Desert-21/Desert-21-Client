import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ModalActionType,
  MovementModalAvailableActionsService,
} from 'src/app/services/rx-logic/double-field-selection/movement-modal-available-actions.service';

@Component({
  selector: 'app-movement-modal',
  templateUrl: './movement-modal.component.html',
  styleUrls: ['./movement-modal.component.scss'],
})
export class MovementModalComponent implements OnInit, OnDestroy {
  isAvailable: [boolean, boolean, boolean, boolean] = [
    false,
    false,
    false,
    false,
  ];
  currentActionType: ModalActionType | null = null;

  @Input() modal: any;

  private sub1: Subscription;

  constructor(
    private availableActionService: MovementModalAvailableActionsService
  ) {}

  ngOnInit(): void {
    this.sub1 = this.availableActionService.getStateUpdates().subscribe((actions) => {
      const canMoveUnits = actions.includes('MOVE_UNITS');
      const canAttack = actions.includes('ATTACK');
      const canBombard = actions.includes('BOMBARD');
      const canFireRocket = actions.includes('FIRE_ROCKET');
      this.isAvailable = [canMoveUnits, canAttack, canBombard, canFireRocket];
      if (this.currentActionType === null) {
        this.currentActionType = actions[0];
      }
    });
    this.availableActionService.requestState();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.currentActionType = null;
  }

  selectActionType(actionType: ModalActionType): void {
    this.currentActionType = actionType;
  }
}
