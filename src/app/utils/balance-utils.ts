import { AllBuildingsBalance } from '../models/game-config-models';
import { Building } from '../models/game-models';

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
