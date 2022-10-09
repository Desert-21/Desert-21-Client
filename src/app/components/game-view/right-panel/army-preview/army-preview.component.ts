import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { FieldSelection } from 'src/app/models/game-utility-models';
import { CurrentScarabsGenerationService } from 'src/app/services/rx-logic/shared/current-scarabs-generation.service';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import { AvailableUnitsService } from 'src/app/services/rx-logic/single-field-selection/available-units.service';
import { SelectedFieldService } from 'src/app/services/rx-logic/single-field-selection/selected-field.service';
import { ScarabsRange } from 'src/app/utils/army-utils';
import {
  EnemyArmyPreviewState,
  OwnedArmyPreviewState,
  DesertArmyPreviewState,
  ArmyPreviewState,
  ArmyDescription,
  ArmyPowerDescription,
} from './army-preview-state';
@Component({
  selector: 'app-army-preview',
  templateUrl: './army-preview.component.html',
  styleUrls: ['./army-preview.component.scss'],
})
export class ArmyPreviewComponent implements OnInit, OnDestroy {
  fieldSelectionEmpty = true;
  currentState: ArmyPreviewState | null = null;
  shouldShowImages: [boolean, boolean, boolean, boolean] = [
    false,
    false,
    false,
    false,
  ];
  armyDescription: ArmyDescription = { droids: '?', tanks: '?', cannons: '?' };
  totalArmyDescription: ArmyDescription | null = null;
  armyPowerDescription: ArmyPowerDescription = {
    defendingPower: '???',
    attackingPower: '???',
  };

  currentScarabsGeneration: ScarabsRange = { min: 0, avg: 0, max: 0 };

  private sub1: Subscription;
  private sub2: Subscription;

  constructor(
    private selectedFieldService: SelectedFieldService,
    private gameContextService: GameContextService,
    private scarabsGenerationService: CurrentScarabsGenerationService,
    private availableUnitsService: AvailableUnitsService
  ) {}

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.selectedFieldService.getStateUpdates(),
      this.gameContextService.getStateUpdates(),
      this.availableUnitsService.getStateUpdates()
    ]).subscribe((data) => {
      const [fieldSelection, context, availableUnits] = data;
      if (fieldSelection === null) {
        this.fieldSelectionEmpty = true;
        return;
      }
      this.fieldSelectionEmpty = false;
      this.currentState = this.getCurrentState(fieldSelection);
      const fieldOwner = context.game.players.find(
        (p) => p.id === fieldSelection.field.ownerId
      );
      const ownerOwnsKingOfDesert = fieldOwner
        ? fieldOwner.upgrades.includes('KING_OF_DESERT')
        : false;
      this.shouldShowImages = this.currentState.getVisibleImages(
        ownerOwnsKingOfDesert
      );
      const { row, col } = fieldSelection;
      this.armyDescription = this.currentState.getArmyDescription(
        availableUnits,
        context,
        {
          row,
          col,
        }
      );
      this.totalArmyDescription = this.currentState.getTotalArmyDescription(
        fieldSelection.field.army,
        availableUnits
      );
      this.armyPowerDescription = this.currentState.getArmyPowerDescription(
        fieldSelection.field.army,
        context,
        fieldSelection
      );
    });
    this.sub2 = this.scarabsGenerationService
      .getStateUpdates()
      .subscribe((range) => {
        this.currentScarabsGeneration = range;
      });
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

  getCurrentState(fieldSelection: FieldSelection): ArmyPreviewState {
    const { isOwned, isEnemy } = fieldSelection;
    if (isOwned) {
      return OwnedArmyPreviewState;
    }
    if (isEnemy) {
      return EnemyArmyPreviewState;
    }
    return DesertArmyPreviewState;
  }
}
