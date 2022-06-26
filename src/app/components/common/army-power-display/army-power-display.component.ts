import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { EstimatedArmy, FightingArmy } from 'src/app/models/army-ranges';
import { GameBalanceConfig } from 'src/app/models/game-config-models';
import { Field, Player } from 'src/app/models/game-models';
import {
  calculateArmyPower,
  calculateFightingArmyPower,
} from 'src/app/utils/army-power-calculator';

@Component({
  selector: 'app-army-power-display',
  templateUrl: './army-power-display.component.html',
  styleUrls: ['./army-power-display.component.scss'],
})
export class ArmyPowerDisplayComponent implements OnInit, OnChanges {
  @Input() isDefending = true;
  @Input() player: Player | null = null;
  @Input() field: Field | null = null;
  @Input() estimatedArmy: EstimatedArmy | null = null;
  @Input() balance: GameBalanceConfig;

  armyPowerDescription = '';

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.arePropertiesInvalid()) {
      return;
    }
    if (this.estimatedArmy.isRange) {
      const wc = this.calculateFightingArmyPowerBasedOnProps(
        this.estimatedArmy.worstCase
      );
      const bc = this.calculateFightingArmyPowerBasedOnProps(
        this.estimatedArmy.bestCase
      );
      this.armyPowerDescription = `${wc}-${bc}`;
    } else {
      this.armyPowerDescription = this.calculateFightingArmyPowerBasedOnProps(
        this.estimatedArmy.averageCase
      ).toString();
    }
  }

  private calculateFightingArmyPowerBasedOnProps(army: FightingArmy): number {
    return calculateFightingArmyPower(
      army,
      this.balance,
      this.player,
      this.field.building,
      this.isDefending
    );
  }

  private arePropertiesInvalid(): boolean {
    return [
      this.isDefending,
      this.player,
      this.field,
      this.estimatedArmy,
      this.balance,
    ].every((e) => e !== null);
  }
}
