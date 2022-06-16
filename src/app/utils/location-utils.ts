import { BoardLocation, Field } from '../models/game-models';

export const findByFieldLocation = (
  location: BoardLocation,
  fields: Array<Array<Field>>
): Field | null => {
  if (!isLocationValid(location)) {
    return null;
  }
  return fields[location.row][location.col];
};

const BOARD_ROWS = 11;
const BOARD_COLS = 11;

export const isLocationValid = (location: BoardLocation) => {
  return (
    location.row >= 0 &&
    location.col >= 0 &&
    location.row < BOARD_ROWS &&
    location.col < BOARD_COLS
  );
};

export const getFogOfWarLevel = (
  location: BoardLocation,
  fields: Array<Array<Field>>,
  playerId: string
): number => {
  const hasLevel1 = getLevel1DistancedFields(location, fields).some(
    (field) => field.ownerId === playerId
  );
  if (hasLevel1) {
    return 1;
  }
  const hasLevel2 = getLevel2DistancedFields(location, fields).some(
    (field) => field.ownerId === playerId
  );
  if (hasLevel2) {
    return 2;
  }
  return 3;
};

export const getLevel1DistancedLocations = (
  location: BoardLocation
): Array<BoardLocation> => {
  const { row, col } = location;
  const potentialLocations: Array<BoardLocation> = [
    { row: row + 1, col },
    { row: row - 1, col: location.col },
    { row, col: col - 1 },
    { row, col: col + 1 },
  ];
  return potentialLocations.filter((loc) => isLocationValid(loc));
};

export const getLevel1DistancedFields = (
  location: BoardLocation,
  fields: Array<Array<Field>>
): Array<Field> => {
  const { row, col } = location;
  return [
    { row: row + 1, col },
    { row: row - 1, col: location.col },
    { row, col: col - 1 },
    { row, col: col + 1 },
  ]
    .filter((loc) => isLocationValid(loc))
    .map((loc) => findByFieldLocation(loc, fields));
};

export const getLevel2DistancedFields = (
  location: BoardLocation,
  fields: Array<Array<Field>>
): Array<Field> => {
  const { row, col } = location;
  return [
    { row: row + 1, col: col + 1 },
    { row: row - 1, col: col + 1 },
    { row: row + 1, col: col - 1 },
    { row: row - 1, col: col + 1 },
  ]
    .filter((loc) => isLocationValid(loc))
    .map((loc) => findByFieldLocation(loc, fields));
};

export const areLocationsEqual = (
  loc1: BoardLocation,
  loc2: BoardLocation
): boolean => {
  return loc1.row === loc2.row && loc1.col === loc2.col;
};

export const flattenFields = (fields: Array<Array<Field>>): Array<Field> => {
  return fields.reduce((prev, next) => {
    prev.push(...next);
    return prev;
  }, []);
};

export const getGeometricDistanceBetween = (
  loc1: BoardLocation,
  loc2: BoardLocation
): number => {
  const xDiff = Math.abs(loc1.col - loc2.col);
  const yDiff = Math.abs(loc1.row - loc2.row);
  return xDiff + yDiff;
};

export const generateEmptyTable = (
  rows: number,
  cols: number
): Array<Array<boolean>> => {
  const acc = [];
  for (let i = 0; i < rows; i++) {
    acc.push([]);
    for (let j = 0; j < cols; j++) {
      acc[i].push(false);
    }
  }
  return acc;
};
