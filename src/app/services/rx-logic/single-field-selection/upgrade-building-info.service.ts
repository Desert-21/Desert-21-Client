import { Injectable } from '@angular/core';
import { PlayersAction, UpgradeActionContent } from 'src/app/models/actions';
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
import { buildingToConfig } from 'src/app/utils/balance-utils';
import { areLocationsEqual } from 'src/app/utils/location-utils';
import {
  ExplainedAvailability,
  getAvailable,
  getNotAvailable,
} from 'src/app/utils/validation';
import { AvailableResourcesService } from '../shared/available-resources.service';
import { GameContextService } from '../shared/game-context.service';
import { ResourceProcessor } from '../templates/resource-processor';
import { SelectedFieldService } from './selected-field.service';

export type UpgradeBuildingInfo = {
  availability: ExplainedAvailability;
  balance: GameBalanceConfig;
  buildingMaterialsCost: number;
  building: Building;
  location: BoardLocation;
  shouldShowTheButton: boolean;
  shouldShowTooltip: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class UpgradeBuildingInfoService extends ResourceProcessor<UpgradeBuildingInfo> {
  constructor(
    private gameContextService: GameContextService,
    private selectedFieldService: SelectedFieldService,
    private availableResourcesService: AvailableResourcesService
  ) {
    super([
      gameContextService,
      selectedFieldService,
      availableResourcesService,
    ]);
  }

  protected processData(dataElements: any[]): UpgradeBuildingInfo {
    const [context, fieldSelection, availableResources] = dataElements as [
      GameContext,
      FieldSelection,
      ResourceSet
    ];
    const balance = context.balance;

    if (fieldSelection === null) {
      return this.getDefault(balance);
    }
    const {
      row,
      col,
      isOwned,
      field: { building },
    } = fieldSelection;
    const location = { row, col };

    const shouldShowTheButton = isOwned && this.isUpgradable(context, building);

    const baseResult = {
      availability: getNotAvailable(''),
      balance,
      buildingMaterialsCost: 0,
      building,
      location,
      shouldShowTheButton,
      shouldShowTooltip: false,
    };
    if (!shouldShowTheButton) {
      return baseResult;
    }
    const buildingMaterialsCost = this.getBuildingCost(context, building);
    const isAlreadyUpgrading = this.isBuildingAlreadyUpgrading(
      context.currentActions,
      location
    );
    const canAfford =
      availableResources.buildingMaterials >= buildingMaterialsCost;
    const isBuildingDefensive =
      building.type === 'TOWER' || building.type === 'HOME_BASE';
    const needsUpgrade = isBuildingDefensive && building.level === 3;
    const hasNecessaryUpgrades =
      !needsUpgrade || context.player.upgrades.includes('THE_GREAT_FORTRESS');

    const availability = this.getAvailability(
      hasNecessaryUpgrades,
      isAlreadyUpgrading,
      canAfford
    );
    const shouldShowTooltip =
      shouldShowTheButton && availability.isAvailable && !isAlreadyUpgrading;

    return {
      ...baseResult,
      shouldShowTooltip,
      availability,
      buildingMaterialsCost,
    };
  }

  private getAvailability(
    hasNecessaryUpgrades: boolean,
    isAlreadyUpgrading: boolean,
    canAfford: boolean
  ): ExplainedAvailability {
    if (!hasNecessaryUpgrades) {
      return getNotAvailable(
        'Upgrade "The Great Fortress" in your lab to unlock level 4!'
      );
    }
    if (isAlreadyUpgrading) {
      return getNotAvailable('Building upgrading has already started.');
    }
    if (!canAfford) {
      return getNotAvailable("You can't afford the upgrade.");
    }
    return getAvailable();
  }

  private getDefault(balance: GameBalanceConfig): UpgradeBuildingInfo {
    return {
      availability: getNotAvailable(''),
      balance,
      buildingMaterialsCost: 0,
      building: {
        type: 'EMPTY_FIELD',
        level: 1,
      },
      location: { row: 0, col: 0 },
      shouldShowTheButton: false,
      shouldShowTooltip: false,
    };
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

  private isBuildingAlreadyUpgrading(
    actions: Array<PlayersAction<any>>,
    location: BoardLocation
  ): boolean {
    return actions
      .filter((a) => a.getType() === 'UPGRADE')
      .map((a) => a.toActionAPIBody().content as UpgradeActionContent)
      .some((a) => areLocationsEqual(a.location, location));
  }
}
