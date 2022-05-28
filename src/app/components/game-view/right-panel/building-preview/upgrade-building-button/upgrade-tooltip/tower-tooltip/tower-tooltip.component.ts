import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  GameBalanceConfig,
  TowerConfig,
} from 'src/app/models/game-config-models';
import { Building, TowerType } from 'src/app/models/game-models';

@Component({
  selector: 'app-tower-tooltip',
  templateUrl: './tower-tooltip.component.html',
  styleUrls: ['./tower-tooltip.component.scss'],
})
export class TowerTooltipComponent implements OnInit, OnChanges {
  @Input() building: Building | null;
  @Input() balance: GameBalanceConfig | null;

  towerName = '';
  fromLevel = 0;
  toLevel = 0;
  fromBaseDefence = 0;
  toBaseDefence = 0;
  fromUnitBonus = 0;
  toUnitBonus = 0;
  unitUnlockSentencePart = '';

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.building === null || this.balance === null) {
      this.towerName = '';
      this.fromLevel = 0;
      this.toLevel = 0;
      this.fromBaseDefence = 0;
      this.toBaseDefence = 0;
      this.fromUnitBonus = 0;
      this.toUnitBonus = 0;
      return;
    }
    const type = this.building.type as TowerType;
    this.towerName = this.getTowerName(type);

    this.fromLevel = this.building.level;
    this.toLevel = this.fromLevel + 1;

    this.setBaseDefenceAndUnitBonus(type, this.balance, this.fromLevel);

    this.unitUnlockSentencePart = this.getUnitUnlockSentencePart(
      this.building.level
    );
  }

  getTowerName(type: TowerType): string {
    switch (type) {
      case 'HOME_BASE':
        return 'Home Base';
      case 'TOWER':
        return 'Tower';
    }
  }

  setBaseDefenceAndUnitBonus(
    type: TowerType,
    balance: GameBalanceConfig,
    buildingLevel: number
  ): void {
    const buildingsConfig = balance.buildings;
    const config: TowerConfig =
      type === 'TOWER' ? buildingsConfig.tower : buildingsConfig.homeBase;
    const { baseProtection, unitBonus } = config;
    switch (buildingLevel) {
      case 1:
        this.fromBaseDefence = baseProtection.level1;
        this.toBaseDefence = baseProtection.level2;
        this.fromUnitBonus = unitBonus.level1;
        this.toUnitBonus = unitBonus.level2;
        break;
      case 2:
        this.fromBaseDefence = baseProtection.level2;
        this.toBaseDefence = baseProtection.level3;
        this.fromUnitBonus = unitBonus.level2;
        this.toUnitBonus = unitBonus.level3;
        break;
      case 3:
        this.fromBaseDefence = baseProtection.level3;
        this.toBaseDefence = baseProtection.level4;
        this.fromUnitBonus = unitBonus.level3;
        this.toUnitBonus = unitBonus.level4;
        break;
      default:
        this.fromBaseDefence = 0;
        this.toBaseDefence = 0;
        this.fromUnitBonus = 0;
        this.toUnitBonus = 0;
    }
    this.fromUnitBonus = Math.round(this.fromUnitBonus * 100);
    this.toUnitBonus = Math.round(this.toUnitBonus * 100);
  }

  getUnitUnlockSentencePart(buildingLevel: number): string {
    switch (buildingLevel) {
      case 1:
        return 'unlock tanks production, ';
      case 2:
        return 'unlock cannons production, ';
      default:
        return '';
    }
  }
}
