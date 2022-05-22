import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import {
  AllBuildingsBalance,
  LeveledValue,
} from 'src/app/models/game-config-models';
import { Building } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import { GameContextService } from 'src/app/services/rx-logic/game-context.service';
import { SelectedFieldService } from 'src/app/services/rx-logic/selected-field.service';

@Component({
  selector: 'app-upgrade-building-button',
  templateUrl: './upgrade-building-button.component.html',
  styleUrls: ['./upgrade-building-button.component.scss'],
})
export class UpgradeBuildingButtonComponent implements OnInit {
  isBuildingUpgradable = false;
  buildingCost = 0;

  constructor(
    private gameContextService: GameContextService,
    private selectedFieldService: SelectedFieldService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.gameContextService.getStateUpdates(),
      this.selectedFieldService.getStateUpdates(),
    ]).subscribe((combined) => {
      const [gameContext, selectedFieldInfo] = combined;
      if (selectedFieldInfo === null) {
        this.isBuildingUpgradable = false;
        return;
      }
      const {
        isOwned,
        field: { building },
      } = selectedFieldInfo;

      this.isBuildingUpgradable =
        isOwned && this.isUpgradable(gameContext, building);

      if (this.isBuildingUpgradable) {
        this.buildingCost = this.getBuildingCost(gameContext, building);
      }
    });
    this.gameContextService.requestState();
    this.selectedFieldService.requestState();
  }

  private getBuildingCost(
    gameContext: GameContext,
    building: Building
  ): number {
    const balance = gameContext.balance.buildings;
    const config = this.buildingToConfig(balance, building);
    const leveledCost = config.cost as LeveledValue | undefined;
    if (leveledCost === undefined) {
      return 0;
    }
    const nextLevel = building.level + 1;
    return this.getCostAtLevel(nextLevel, leveledCost);
  }

  private buildingToConfig(
    buildingsBalance: AllBuildingsBalance,
    building: Building
  ): any {
    switch (building.type) {
      case 'TOWER':
        return buildingsBalance.tower;
      case 'ROCKET_LAUNCHER':
        return buildingsBalance.rocketLauncher;
      case 'HOME_BASE':
        return buildingsBalance.homeBase;
      case 'METAL_FACTORY':
      case 'BUILDING_MATERIALS_FACTORY':
      case 'ELECTRICITY_FACTORY':
        return buildingsBalance.factory;
      default:
        return null;
    }
  }

  private isUpgradable(gameContext: GameContext, building: Building): boolean {
    const balance = gameContext.balance.buildings;
    const config = this.buildingToConfig(balance, building);
    if (config === null) {
      return false;
    }
    const leveledCost = config.cost as LeveledValue | undefined;
    if (leveledCost === undefined) {
      return false;
    }
    const firstUpgradableIndex = [
      leveledCost.level4,
      leveledCost.level3,
      leveledCost.level2,
      leveledCost.level1,
    ].findIndex((lvl) => lvl !== -1);

    if (firstUpgradableIndex === -1) {
      return false;
    }

    const maxUpgradingLevel = 4 - firstUpgradableIndex;
    const nextLevel = building.level + 1;
    return nextLevel <= maxUpgradingLevel;
  }

  private getCostAtLevel(level: number, value: LeveledValue): number {
    switch (level) {
      case 1:
        return value.level1;
      case 2:
        return value.level2;
      case 3:
        return value.level3;
      case 4:
        return value.level4;
      default:
        return 0;
    }
  }
}
