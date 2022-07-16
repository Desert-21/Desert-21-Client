import { Injectable } from '@angular/core';
import { BuildBuildingAction } from 'src/app/models/actions';
import { AllBuildingsBalance } from 'src/app/models/game-config-models';
import {
  BuildBuildingEventContent,
  BuildingType,
  ResourceSet,
} from 'src/app/models/game-models';
import {
  FieldSelection,
  GameContext,
} from 'src/app/models/game-utility-models';
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

export type EnrichedBuildingOption = {
  buildingType: BuildingType;
  imageSource: string;
  buildingMaterialsCost: number;
  availability: ExplainedAvailability;
};

@Injectable({
  providedIn: 'root',
})
export class BuildBuildingOptionsService extends ResourceProcessor<
  Array<EnrichedBuildingOption>
> {
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

  protected processData(dataElements: any[]): Array<EnrichedBuildingOption> {
    const [context, fieldSelection, availableResources] = dataElements as [
      GameContext,
      FieldSelection,
      ResourceSet
    ];
    return [
      this.getBuildingTypeOption(
        'METAL_FACTORY',
        context,
        fieldSelection,
        availableResources
      ),
      this.getBuildingTypeOption(
        'BUILDING_MATERIALS_FACTORY',
        context,
        fieldSelection,
        availableResources
      ),
      this.getBuildingTypeOption(
        'ELECTRICITY_FACTORY',
        context,
        fieldSelection,
        availableResources
      ),
      this.getBuildingTypeOption(
        'TOWER',
        context,
        fieldSelection,
        availableResources
      ),
    ];
  }

  private getBuildingTypeOption(
    buildingType: BuildingType,
    context: GameContext,
    fieldSelection: FieldSelection,
    availableResources: ResourceSet
  ): EnrichedBuildingOption {
    return {
      buildingType,
      imageSource: this.getBuildingImageSource(buildingType),
      buildingMaterialsCost: this.getBuildingCost(
        buildingType,
        context.balance.buildings
      ),
      availability: this.getBuildingTypeAvailability(
        buildingType,
        context,
        fieldSelection,
        availableResources
      ),
    };
  }

  private getBuildingImageSource(buildingType: BuildingType): string {
    switch (buildingType) {
      case 'METAL_FACTORY':
        return '/assets/buildings/metal.png';
      case 'BUILDING_MATERIALS_FACTORY':
        return '/assets/buildings/buildingMaterials.png';
      case 'ELECTRICITY_FACTORY':
        return '/assets/buildings/electricity.png';
      default:
        return '/assets/buildings/tower.png';
    }
  }

  private getBuildingCost(
    buildingType: BuildingType,
    balance: AllBuildingsBalance
  ): number {
    return buildingType === 'TOWER'
      ? balance.tower.cost.level1
      : balance.factory.cost.level1;
  }

  private getBuildingTypeAvailability(
    buildingType: BuildingType,
    context: GameContext,
    fieldSelection: FieldSelection,
    availableResources: ResourceSet
  ): ExplainedAvailability {
    if (buildingType === 'TOWER') {
      return this.getTowerAvailability(
        context,
        fieldSelection,
        availableResources
      );
    } else {
      return this.getFactoryAvailability(
        context,
        fieldSelection,
        availableResources
      );
    }
  }

  private getTowerAvailability(
    context: GameContext,
    fieldSelection: FieldSelection,
    availableResources: ResourceSet
  ): ExplainedAvailability {
    const player = context.player;
    if (!player.upgrades.includes('TOWER_CREATOR')) {
      return getNotAvailable(
        'You need to upgrade "Tower Creator" to build that building!'
      );
    }

    if (!this.isFieldActuallyEmpty(context, fieldSelection)) {
      return getNotAvailable('Field must be empty!');
    }

    const totalTowersBuilt = this.getTotalBuildingsBuilt(
      context,
      ['TOWER'],
      'builtTowers'
    );
    const maxTowersBuilt =
      context.balance.upgrades.control.balanceConfig.towerCreatorMaxTowersBuilt;
    if (maxTowersBuilt <= totalTowersBuilt) {
      return getNotAvailable('You cannot build any more towers!');
    }

    const canAfford =
      context.balance.buildings.tower.cost.level1 <=
      availableResources.buildingMaterials;
    if (!canAfford) {
      return getNotAvailable(
        'You don\'t have enough building materials for this building!'
      );
    }
    return getAvailable();
  }

  private getFactoryAvailability(
    context: GameContext,
    fieldSelection: FieldSelection,
    availableResources: ResourceSet
  ): ExplainedAvailability {
    const player = context.player;
    if (!player.upgrades.includes('FACTORY_BUILDERS')) {
      return getNotAvailable(
        'You need to upgrade "Factory Builders" to build that building!'
      );
    }

    if (!this.isFieldActuallyEmpty(context, fieldSelection)) {
      return getNotAvailable('Field must be empty!');
    }

    const totalFactoriesBuilt = this.getTotalBuildingsBuilt(
      context,
      ['METAL_FACTORY', 'BUILDING_MATERIALS_FACTORY', 'ELECTRICITY_FACTORY'],
      'builtTowers'
    );
    const maxFactoriesBuilt =
      context.balance.upgrades.production.balanceConfig
        .factoryBuildingMaxFactoriesBuilt;
    if (maxFactoriesBuilt <= totalFactoriesBuilt) {
      return getNotAvailable('You cannot build any more factories!');
    }
    const canAfford =
      context.balance.buildings.factory.cost.level1 <=
      availableResources.buildingMaterials;
    if (!canAfford) {
      return getNotAvailable(
        'You don\'t have enough building materials for this building!'
      );
    }
    return getAvailable();
  }

  private isFieldActuallyEmpty(
    context: GameContext,
    fieldSelection: FieldSelection
  ): boolean {
    if (fieldSelection === null) {
      return false;
    }
    const isOngoingBuildingAlreadyOnField = context.game.events
      .filter((e) => e.type === 'BUILD')
      .map((e) => e.content as BuildBuildingEventContent)
      .some((c) => areLocationsEqual(fieldSelection, c.location));
    const isBuildingBuiltOnField = context.currentActions
      .filter((a) => a.getType() === 'BUILD')
      .map((a) => a as BuildBuildingAction)
      .some((a) => areLocationsEqual(a.location, fieldSelection));
    const isBuildingEmpty =
      fieldSelection.field.building.type === 'EMPTY_FIELD';
    return (
      isBuildingEmpty &&
      !isBuildingBuiltOnField &&
      !isOngoingBuildingAlreadyOnField
    );
  }

  private getTotalBuildingsBuilt(
    context: GameContext,
    buildingTypes: Array<BuildingType>,
    builtBuildingsFieldName: string
  ): number {
    const player = context.player;
    const currentBuildBuildingEvents = context.game.events
      .filter((e) => e.type === 'BUILD')
      .map((e) => e.content as BuildBuildingEventContent)
      .filter((c) => buildingTypes.includes(c.buildingType)).length;

    const currentlyBuiltBuildings = context.currentActions
      .filter((a) => a.getType() === 'BUILD')
      .map((a) => a as BuildBuildingAction)
      .filter((a) => buildingTypes.includes(a.buildingType)).length;
    return (
      player?.[builtBuildingsFieldName] +
      currentlyBuiltBuildings +
      currentBuildBuildingEvents
    );
  }
}
