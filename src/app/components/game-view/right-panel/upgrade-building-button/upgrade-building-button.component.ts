import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import {
  PlayersAction,
  UpgradeAction,
  UpgradeActionContent,
} from 'src/app/models/actions';
import {
  AllBuildingsBalance,
  LeveledValue,
} from 'src/app/models/game-config-models';
import { BoardLocation, Building } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import { AvailableResourcesService } from 'src/app/services/rx-logic/available-resources.service';
import { CurrentActionsService } from 'src/app/services/rx-logic/current-actions.service';
import { GameContextService } from 'src/app/services/rx-logic/game-context.service';
import { SelectedFieldService } from 'src/app/services/rx-logic/selected-field.service';

@Component({
  selector: 'app-upgrade-building-button',
  templateUrl: './upgrade-building-button.component.html',
  styleUrls: ['./upgrade-building-button.component.scss'],
})
export class UpgradeBuildingButtonComponent implements OnInit {
  isBuildingUpgradable = false; // too high level already, not owned
  isUpgradingLocked = true; // not enough resources, already upgrading
  buildingCost = 0;
  location: BoardLocation | null = null;

  constructor(
    private gameContextService: GameContextService,
    private selectedFieldService: SelectedFieldService,
    private currentActionsService: CurrentActionsService,
    private availableResourcesService: AvailableResourcesService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.gameContextService.getStateUpdates(),
      this.selectedFieldService.getStateUpdates(),
      this.availableResourcesService.getStateUpdates()
    ]).subscribe((combined) => {
      const [gameContext, selectedFieldInfo, availableResources] = combined;
      if (selectedFieldInfo === null) {
        this.isBuildingUpgradable = false;
        this.location = null;
        return;
      }

      const { row, col } = selectedFieldInfo;
      this.location = { row, col };

      const {
        isOwned,
        field: { building },
      } = selectedFieldInfo;

      this.isBuildingUpgradable =
        isOwned && this.isUpgradable(gameContext, building);

      const isAlreadyUpgrading = this.isBuildingAlreadyUpgrading(
        gameContext.currentActions
      );

      if (this.isBuildingUpgradable) {
        this.buildingCost = this.getBuildingCost(gameContext, building);
      }

      const canAfford = availableResources.buildingMaterials >= this.buildingCost;

      if (this.isBuildingUpgradable) {
        this.isUpgradingLocked = isAlreadyUpgrading || !canAfford;
      }

    });
    this.gameContextService.requestState();
    this.selectedFieldService.requestState();
  }

  private isBuildingAlreadyUpgrading(
    actions: Array<PlayersAction<any>>
  ): boolean {
    return actions
      .filter((a) => a.getType() === 'UPGRADE')
      .map((a) => a.getContent() as UpgradeActionContent)
      .some(
        (a) =>
          a.location.row === this.location.row &&
          a.location.col === this.location.col
      );
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

  upgradeBuilding(): void {
    const action = new UpgradeAction(this.buildingCost, this.location);
    this.currentActionsService.pushAction(action);
  }
}
