import { Component, ContentChild, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { TrainAction } from 'src/app/models/actions';
import {
  AllCombatBalance,
  CombatUnitConfig,
} from 'src/app/models/game-config-models';
import {
  BoardLocation,
  TrainingMode,
  UnitType,
} from 'src/app/models/game-models';
import {
  FieldSelection,
  GameContext,
} from 'src/app/models/game-utility-models';
import { CurrentActionsService } from 'src/app/services/rx-logic/current-actions.service';
import { GameContextService } from 'src/app/services/rx-logic/game-context.service';
import { SelectedFieldService } from 'src/app/services/rx-logic/selected-field.service';
import { canTrainUnits } from 'src/app/utils/army-utils';

type TrainingOption = {
  unitType: UnitType;
  trainingMode: TrainingMode;
};

type EnrichedTrainingOption = TrainingOption & {
  amount: number;
  cost: number;
  imageSource: string;
  isAvailable: boolean;
};

const trainingOptions: Array<TrainingOption> = [
  { unitType: 'DROID', trainingMode: 'SMALL_PRODUCTION' },
  { unitType: 'TANK', trainingMode: 'SMALL_PRODUCTION' },
  { unitType: 'CANNON', trainingMode: 'SMALL_PRODUCTION' },
  { unitType: 'DROID', trainingMode: 'MEDIUM_PRODUCTION' },
  { unitType: 'TANK', trainingMode: 'MEDIUM_PRODUCTION' },
  { unitType: 'CANNON', trainingMode: 'MEDIUM_PRODUCTION' },
  { unitType: 'DROID', trainingMode: 'MASS_PRODUCTION' },
  { unitType: 'TANK', trainingMode: 'MASS_PRODUCTION' },
  { unitType: 'CANNON', trainingMode: 'MASS_PRODUCTION' },
];

@Component({
  selector: 'app-train-army-button-section',
  templateUrl: './train-army-button-section.component.html',
  styleUrls: ['./train-army-button-section.component.scss'],
})
export class TrainArmyButtonSectionComponent implements OnInit {
  enrichedTrainingOptions: Array<EnrichedTrainingOption> = [];
  location: BoardLocation | null = null;
  isTrainingButtonVisible = false;
  isTrainingButtonDisabled = false;

  constructor(
    private gameContextService: GameContextService,
    private selectedFieldService: SelectedFieldService,
    private currentActionsService: CurrentActionsService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.gameContextService.getStateUpdates(),
      this.selectedFieldService.getStateUpdates(),
    ]).subscribe((updates) => {
      const [context, fieldInfo] = updates;

      if (fieldInfo === null) {
        return;
      }

      this.location = { row: fieldInfo.row, col: fieldInfo.col };

      this.enrichedTrainingOptions = trainingOptions.map((o) =>
        this.enrichTrainingOption(o, context, fieldInfo)
      );
    });

    this.gameContextService.requestState();
    this.selectedFieldService.requestState();
  }

  saveArmyTraining(option: EnrichedTrainingOption): void {
    if (!option.isAvailable) {
      return;
    }
    const action = new TrainAction(
      this.location,
      option.cost,
      option.unitType,
      option.trainingMode,
      option.amount
    );
    this.currentActionsService.pushAction(action);
  }

  private enrichTrainingOption(
    option: TrainingOption,
    context: GameContext,
    fieldSelection: FieldSelection
  ): EnrichedTrainingOption {
    const combatConfig = context.balance.combat;
    const config = this.getUnitConfig(combatConfig, option.unitType);
    const amount = this.getProducedAmount(config, option.trainingMode);
    const cost = amount * config.cost;
    const imageSource = this.getImageSource(option.unitType);

    const isAvailable = canTrainUnits(
      context.player,
      fieldSelection.field.building,
      option.trainingMode,
      option.unitType
    );
    return {
      ...option,
      amount,
      cost,
      imageSource,
      isAvailable,
    };
  }

  private getUnitConfig(
    balance: AllCombatBalance,
    unitType: UnitType
  ): CombatUnitConfig {
    switch (unitType) {
      case 'DROID':
        return balance.droids;
      case 'TANK':
        return balance.tanks;
      case 'CANNON':
        return balance.cannons;
    }
  }

  private getProducedAmount(
    config: CombatUnitConfig,
    trainingMode: TrainingMode
  ): number {
    switch (trainingMode) {
      case 'SMALL_PRODUCTION':
        return config.smallProduction;
      case 'MEDIUM_PRODUCTION':
        return config.mediumProduction;
      case 'MASS_PRODUCTION':
        return config.massProduction;
    }
  }

  private getImageSource(unitType: UnitType): string {
    switch (unitType) {
      case 'DROID':
        return '/assets/mechs/droid-full.png';
      case 'TANK':
        return '/assets/mechs/tank-full.png';
      case 'CANNON':
        return '/assets/mechs/cannon-full.png';
    }
  }
}
