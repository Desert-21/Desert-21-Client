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

// todo: finish when graphics are there
export const getBuildingImage = (buildingType: BuildingType, level: number) => {
  switch (buildingType) {
    case 'METAL_FACTORY':
      return '/assets/buildings/metal.png';
    case 'BUILDING_MATERIALS_FACTORY':
      return '/assets/buildings/buildingMaterials.png';
    case 'ELECTRICITY_FACTORY':
      return '/assets/buildings/electricity.png';
    case 'TOWER':
      return '/assets/buildings/tower.png';
    case 'HOME_BASE':
      return '/assets/buildings/tower.png';
    case 'ROCKET_LAUNCHER':
      return '/assets/buildings/rocket.png';
    default:
      return '/assets/buildings/unknownBuilding.png';
  }
}
