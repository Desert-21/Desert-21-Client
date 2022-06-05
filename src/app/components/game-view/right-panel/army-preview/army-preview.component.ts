import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { FieldSelection } from 'src/app/models/game-utility-models';
import { GameContextService } from 'src/app/services/rx-logic/game-context.service';
import { SelectedFieldService } from 'src/app/services/rx-logic/selected-field.service';
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
export class ArmyPreviewComponent implements OnInit {
  currentState: ArmyPreviewState | null = null;
  shouldShowImages: [boolean, boolean, boolean, boolean] = [
    false,
    false,
    false,
    false,
  ];
  armyDescription: ArmyDescription = { droids: '?', tanks: '?', cannons: '?' };
  armyPowerDescription: ArmyPowerDescription = {
    defendingPower: '???',
    attackingPower: '???',
  };

  constructor(
    private selectedFieldService: SelectedFieldService,
    private gameContextService: GameContextService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.selectedFieldService.getStateUpdates(),
      this.gameContextService.getStateUpdates(),
    ]).subscribe((data) => {
      const [fieldSelection, context] = data;
      this.currentState = this.getCurrentState(fieldSelection);
      this.shouldShowImages = this.currentState.getVisibleImages(false); // todo: change!
      const { row, col } = fieldSelection;
      this.armyDescription = this.currentState.getArmyDescription(
        fieldSelection.field.army,
        context,
        {
          row,
          col,
        }
      );
      this.armyPowerDescription = this.currentState.getArmyPowerDescription(
        fieldSelection.field.army,
        context,
        fieldSelection
      );
    });
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
