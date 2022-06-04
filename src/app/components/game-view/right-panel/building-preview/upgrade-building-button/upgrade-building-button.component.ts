import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import {
  PlayersAction,
  UpgradeAction,
  UpgradeActionContent,
} from 'src/app/models/actions';
import {
  GameBalanceConfig,
  LeveledValue,
} from 'src/app/models/game-config-models';
import {
  BoardLocation,
  Building,
  ResourceSet,
} from 'src/app/models/game-models';
import {
  FieldSelection,
  GameContext,
} from 'src/app/models/game-utility-models';
import { AvailableResourcesService } from 'src/app/services/rx-logic/available-resources.service';
import { CurrentActionsService } from 'src/app/services/rx-logic/current-actions.service';
import { GameContextService } from 'src/app/services/rx-logic/game-context.service';
import { SelectedFieldService } from 'src/app/services/rx-logic/selected-field.service';
import { buildingToConfig } from 'src/app/utils/balance-utils';

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
  building: Building | null = null;
  balance: GameBalanceConfig | null = null;

  shouldShowTooltip = false;

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
      this.availableResourcesService.getStateUpdates(),
    ]).subscribe((combined) => {
      const [gameContext, selectedFieldInfo, availableResources] = combined;
      this.reactToRxUpdate(gameContext, selectedFieldInfo, availableResources);
    });
    this.gameContextService.requestState();
    this.selectedFieldService.requestState();
    this.availableResourcesService.requestState();
  }

  private reactToRxUpdate(
    gameContext: GameContext,
    selectedFieldInfo: FieldSelection,
    availableResources: ResourceSet
  ): void {
    this.balance = gameContext.balance;

    if (gameContext === null || selectedFieldInfo === null) {
      this.resetDefaults();
      return;
    }

    const { row, col } = selectedFieldInfo;
    this.location = { row, col };

    const {
      isOwned,
      field: { building },
    } = selectedFieldInfo;

    this.building = building;

    this.isBuildingUpgradable =
      isOwned && this.isUpgradable(gameContext, building);

    if (this.isBuildingUpgradable) {
      this.buildingCost = this.getBuildingCost(gameContext, building);
    }

    const isAlreadyUpgrading = this.isBuildingAlreadyUpgrading(
      gameContext.currentActions,
      { row, col }
    );
    const canAfford = availableResources.buildingMaterials >= this.buildingCost;
    if (this.isBuildingUpgradable) {
      this.isUpgradingLocked = isAlreadyUpgrading || !canAfford;
    }

    this.shouldShowTooltip = this.shouldShowTheTooltip(
      this.isBuildingUpgradable,
      this.isUpgradingLocked,
      isAlreadyUpgrading
    );
  }

  private resetDefaults(): void {
    this.isBuildingUpgradable = false;
    this.location = null;
    this.building = null;
    this.isUpgradingLocked = true; // not enough resources, already upgrading
    this.buildingCost = 0;
    this.balance = null;
    this.shouldShowTooltip = false;
  }

  private isBuildingAlreadyUpgrading(
    actions: Array<PlayersAction<any>>,
    location: BoardLocation
  ): boolean {
    return actions
      .filter((a) => a.getType() === 'UPGRADE')
      .map((a) => a.toActionAPIBody() as UpgradeActionContent)
      .some(
        (a) =>
          a.location.row === location.row && a.location.col === location.col
      );
  }

  private getBuildingCost(
    gameContext: GameContext,
    building: Building
  ): number {
    const balance = gameContext.balance.buildings;
    const config = buildingToConfig(balance, building);
    const leveledCost = config.cost as LeveledValue | undefined;
    if (leveledCost === undefined) {
      return 0;
    }
    const nextLevel = building.level + 1;
    return this.getCostAtLevel(nextLevel, leveledCost);
  }

  private isUpgradable(gameContext: GameContext, building: Building): boolean {
    const balance = gameContext.balance.buildings;
    const config = buildingToConfig(balance, building);
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

  shouldShowTheTooltip(
    isUpgradable: boolean,
    isUpgradingLocked: boolean,
    isAlreadyUpgrading: boolean
  ): boolean {
    if (isUpgradable && !isUpgradingLocked) {
      return true;
    }
    if (isUpgradingLocked && !isAlreadyUpgrading) {
      return true;
    }
    return false;
  }
}
