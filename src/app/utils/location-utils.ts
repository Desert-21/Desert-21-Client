import { NumberSymbol } from '@angular/common';
import { BoardLocation, Field } from '../models/game-models';

export const findByFieldLocation = (
  row: number,
  col: number,
  fields: Array<Array<Field>>
): Field | null => {
  if (!isLocationValid(row, col)) {
    return null;
  }
  return fields[row][col];
};

const BOARD_ROWS = 11;
const BOARD_COLS = 11;

export const isLocationValid = (row: number, col: number) => {
  return row >= 0 && col >= 0 && row < BOARD_ROWS && col < BOARD_COLS;
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
  return potentialLocations.filter((loc) => isLocationValid(loc.row, loc.col));
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
    .filter((loc) => isLocationValid(loc.row, loc.col))
    .map((loc) => findByFieldLocation(loc.row, loc.col, fields));
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
    .filter((loc) => isLocationValid(loc.row, loc.col))
    .map((loc) => findByFieldLocation(loc.row, loc.col, fields));
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
