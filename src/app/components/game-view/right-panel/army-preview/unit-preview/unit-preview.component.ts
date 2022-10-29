import { Component, Input, OnInit } from '@angular/core';
import { UnitType } from 'src/app/models/game-models';
import {
  defaultSingleUnitStats,
  ScarabStats,
  SingleUnitStats,
} from 'src/app/services/rx-logic/single-field-selection/unit-stats.service';
import { AllUnitTypes, getUnitImage } from 'src/app/utils/army-utils';
import { unitTypeToConfig } from 'src/app/utils/balance-utils';
import {
  camelCaseToCapsLock,
  underscoreToRegular,
} from 'src/app/utils/text-utils';

type Metric = {
  name: string;
  amount: number;
  relativeAmount: string;
  unit: string | null;
};

@Component({
  selector: 'app-unit-preview',
  templateUrl: './unit-preview.component.html',
  styleUrls: ['./unit-preview.component.scss'],
})
export class UnitPreviewComponent implements OnInit {
  metrics: Array<Metric> = [];

  description = '';
  imagePath = '/assets/mechs/droid-full.png';

  constructor() {}

  ngOnInit(): void {}

  @Input()
  set unitType(unitType: AllUnitTypes) {
    this.imagePath = getUnitImage(unitType);
    this.description = this.getDescription(unitType);
  }

  @Input()
  set stats(stats: SingleUnitStats | ScarabStats) {
    this.metrics = this.statsToMetrics(stats);
  }

  private getDescription(unitType: AllUnitTypes): string {
    switch (unitType) {
      case 'DROID':
        return 'Droids are balanced units that are very quick to train and can give you a huge advantage early in the game!';
      case 'TANK':
        return 'Tanks are the most powerful units, but also the slowest to move or train. Use them with caution!';
      case 'CANNON':
        return 'Cannons are very mobile, tactical units. After upgrading, they can attack without taking any damage.';
      case 'SCARAB':
        return "Scarabs are the units that defent unoccupied fields. They can't attack nor be trained.";
    }
  }

  private statsToMetrics(stats: SingleUnitStats | ScarabStats): Array<Metric> {
    const entries = Object.entries(stats);

    const absoluteAmounts = entries.filter(([key]) => !key.includes('Ratio'));
    const relativeAmounts = entries.filter(([key]) => key.includes('Ratio'));

    return absoluteAmounts.map(([key, value]) => {
      const relativeName = `${key}Ratio`;
      console.log(relativeName);
      const relativeAmount = relativeAmounts.find(
        ([relativeKey]) => relativeKey === relativeName
      )[1];
      return {
        name: camelCaseToCapsLock(key),
        amount: value,
        relativeAmount: `${Math.round(relativeAmount * 100)}%`,
        unit: this.getUnit(key),
      };
    });
  }

  private getUnit(name: string): string | null {
    switch (name) {
      case 'cost':
        return 'METAL';
      case 'movementSpeed':
        return 'FIELDS';
      case 'trainingSpeed':
        return 'TURNS';
      default:
        return null;
    }
  }
}
