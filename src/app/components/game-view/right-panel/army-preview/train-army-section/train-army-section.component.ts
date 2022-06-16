import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { TrainAction } from 'src/app/models/actions';
import { TrainingEventContent } from 'src/app/models/game-models';
import {
  FieldSelection,
  GameContext,
} from 'src/app/models/game-utility-models';
import { GameContextService } from 'src/app/services/rx-logic/game-context.service';
import { SelectedFieldService } from 'src/app/services/rx-logic/selected-field.service';
import { unitTypeToConfig } from 'src/app/utils/balance-utils';
import { areLocationsEqual } from 'src/app/utils/location-utils';

@Component({
  selector: 'app-train-army-section',
  templateUrl: './train-army-section.component.html',
  styleUrls: ['./train-army-section.component.scss'],
})
export class TrainArmySectionComponent implements OnInit, OnDestroy {
  showScarabInfo = false;
  showEnemyInfo = false;
  showQueue = false;
  showButton = false;
  showCantTrainHereInfo = false;

  optionalPendingTraining: TrainingEventContent;

  private sub1: Subscription;

  constructor(
    private gameContextService: GameContextService,
    private selectedFieldService: SelectedFieldService
  ) {}

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.gameContextService.getStateUpdates(),
      this.selectedFieldService.getStateUpdates(),
    ]).subscribe((updates) => {
      const [context, fieldInfo] = updates;
      if (fieldInfo === null) {
        return;
      }
      this.resetVisibility();
      if (!fieldInfo.isEnemy && !fieldInfo.isOwned) {
        this.showScarabInfo = true;
        return;
      }
      if (fieldInfo.isEnemy) {
        this.showEnemyInfo = true;
        return;
      }
      this.optionalPendingTraining = this.getPendingTraining(
        context,
        fieldInfo
      );
      if (this.optionalPendingTraining !== null) {
        this.showQueue = true;
        return;
      }
      if (this.isTowerOfHomebase(fieldInfo)) {
        this.showButton = true;
        return;
      }
      this.showCantTrainHereInfo = true;
    });
    this.gameContextService.requestState();
    this.selectedFieldService.requestState();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }

  private resetVisibility(): void {
    this.showButton = false;
    this.showCantTrainHereInfo = false;
    this.showEnemyInfo = false;
    this.showQueue = false;
    this.showScarabInfo = false;
  }

  private getPendingTraining(
    context: GameContext,
    fieldInfo: FieldSelection
  ): TrainingEventContent | null {
    const fieldLocation = { row: fieldInfo.row, col: fieldInfo.col };
    const optionalAction = context.currentActions
      .filter((action) => action.getType() === 'TRAIN')
      .map((action) => action as TrainAction)
      .find((action) => areLocationsEqual(action.location, fieldLocation));
    if (optionalAction !== undefined) {
      return {
        turnsToExecute: this.getTurnsToExecute(context, optionalAction),
        location: optionalAction.location,
        unitType: optionalAction.unitType,
        amount: optionalAction.amount,
      };
    }
    const optionalEvent = context.game.events
      .filter((event) => event.type === 'TRAINING')
      .map((event) => event.content)
      .find((content) => areLocationsEqual(content.location, fieldLocation));
    if (optionalEvent !== undefined) {
      return optionalEvent;
    }
    return null;
  }

  private getTurnsToExecute(context: GameContext, action: TrainAction): number {
    const unitType = action.unitType;
    const combatBalance = context.balance.combat;
    const config = unitTypeToConfig(combatBalance, unitType);
    return (config.turnsToTrain - 1) * 2;
  }

  private isTowerOfHomebase(fieldInfo: FieldSelection): boolean {
    const buildingType = fieldInfo.field.building.type;
    return buildingType === 'TOWER' || buildingType === 'HOME_BASE';
  }
}
