import {
  AllBuildingsBalance,
  AllCombatBalance,
  CombatUnitConfig,
} from '../models/game-config-models';
import {
  Building,
  BuildingType,
  TrainingMode,
  UnitType,
} from '../models/game-models';

export const buildingToConfig = (
  buildingsBalance: AllBuildingsBalance,
  building: Building
): any => {
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
};

export const buildingTypeToConfig = (
  buildingsBalance: AllBuildingsBalance,
  buildingType: BuildingType
): any => {
  switch (buildingType) {
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
};

export const unitTypeToConfig = (
  combatBalance: AllCombatBalance,
  unitType: UnitType
): CombatUnitConfig => {
  switch (unitType) {
    case 'DROID':
      return combatBalance.droids;
    case 'TANK':
      return combatBalance.tanks;
    case 'CANNON':
      return combatBalance.cannons;
  }
};

export const trainingModeToAmount = (
  trainingMode: TrainingMode,
  combatUnitConfig: CombatUnitConfig
): number => {
  switch (trainingMode) {
    case 'SMALL_PRODUCTION':
      return combatUnitConfig.smallProduction;
    case 'MEDIUM_PRODUCTION':
      return combatUnitConfig.mediumProduction;
    case 'MASS_PRODUCTION':
      return combatUnitConfig.massProduction;
  }
};
