import { LeveledValue } from '../models/game-config-models';
import { Building, BuildingType } from '../models/game-models';

export const isDefensive = (building: Building): boolean => {
  const type = building.type;
  return type === 'TOWER' || type === 'HOME_BASE';
};

export const isFactory = (building: Building): boolean => {
  const type = building.type;
  return (
    type === 'METAL_FACTORY' ||
    type === 'BUILDING_MATERIALS_FACTORY' ||
    type === 'ELECTRICITY_FACTORY'
  );
};

export const getLeveledValueByLevel = (
  leveledValue: LeveledValue,
  level: number
): number => {
  switch (level) {
    case 1:
      return leveledValue.level1;
    case 2:
      return leveledValue.level2;
    case 3:
      return leveledValue.level3;
    case 4:
      return leveledValue.level4;
    default:
      return 0;
  }
};

export const getBuildingImage = (buildingType: BuildingType, level: number) => {
  return getBuildingImageWithDefault(buildingType, level, '/assets/buildings/unknown-building.png');
};

export const getBuildingImageWithDefault = (buildingType: BuildingType, level: number, ifNothingFound: string) => {
  switch (buildingType) {
    case 'METAL_FACTORY':
      return '/assets/buildings/metal-factory.png';
    case 'BUILDING_MATERIALS_FACTORY':
      return '/assets/buildings/building-materials-factory.png';
    case 'ELECTRICITY_FACTORY':
      return '/assets/buildings/electricity-factory.png';
    case 'TOWER':
      return '/assets/buildings/tower.png';
    case 'HOME_BASE':
      return '/assets/buildings/home-base.png';
    case 'ROCKET_LAUNCHER':
      return '/assets/buildings/rocket-launcher.png';
    case 'EMPTY_FIELD':
      return '/assets/buildings/empty.png';
    default:
      return ifNothingFound;
  }
};

