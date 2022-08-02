import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import {
  BuildBuildingAction,
  LabAction,
  PlayersAction,
  TrainAction,
  UpgradeAction
} from 'src/app/models/actions';
import { GameContext } from 'src/app/models/game-utility-models';
import { CurrentActionsService } from 'src/app/services/rx-logic/shared/current-actions.service';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import { findByFieldLocation } from 'src/app/utils/location-utils';
import { underscoreToKebabCase, underscoreToRegular } from 'src/app/utils/text-utils';

@Component({
  selector: 'app-action-entry',
  templateUrl: './action-entry.component.html',
  styleUrls: ['./action-entry.component.scss'],
})
export class ActionEntryComponent implements OnInit, OnDestroy {
  private actionSubject = new BehaviorSubject<PlayersAction<any>>(null);

  actionHeader = '';
  backgroundClass = '';

  private sub1: Subscription;

  constructor(
    private currentActionsService: CurrentActionsService,
    private gameContextService: GameContextService
  ) {}

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.actionSubject.asObservable(),
      this.gameContextService.getStateUpdates(),
    ]).subscribe(([action, context]) => {
      this.actionHeader = this.getActionHeader(action, context);
      this.backgroundClass = this.getBackgroundClass(action);
    });
    this.gameContextService.requestState();
  }

  getActionHeader(action: PlayersAction<any>, context: GameContext): string {
    const type = action.getType();
    switch (type) {
      case 'UPGRADE':
        const upgradeAction = action as UpgradeAction;
        const buildingType = findByFieldLocation(
          upgradeAction.location,
          context.game.fields
        ).building.type;
        return `Upgrade ${underscoreToRegular(buildingType)}`;
      case 'ATTACK':
        return 'Attack';
      case 'MOVE_UNITS':
        return 'Move Units';
      case 'TRAIN':
        const trainAction = action as TrainAction;
        const unitType = trainAction.unitType;
        return `Train ${underscoreToRegular(unitType)}s`;
      case 'LAB_EVENT':
        const labAction = action as LabAction;
        return `Lab Upgrade: ${underscoreToRegular(labAction.upgrade)}`;
      case 'FIRE_ROCKET':
        return 'Rocket Strike';
      case 'BUILD':
        const buildAction = action as BuildBuildingAction;
        return `Build ${underscoreToRegular(buildAction.buildingType)}`;
      case 'BOMBARD':
        return 'Bombarding';
    }
  }

  getBackgroundClass(action: PlayersAction<any>): string {
    const actionKebabCase = underscoreToKebabCase(action.getType());
    return `background-${actionKebabCase}`;
  }

  removeFromActionsList(): void {
    this.currentActionsService.removeAction(this.action);
  }

  get action(): PlayersAction<any> {
    return this.actionSubject.getValue();
  }

  @Input()
  set action(action: PlayersAction<any>) {
    this.actionSubject.next(action);
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
