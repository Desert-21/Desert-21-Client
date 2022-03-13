import { NumberSymbol } from '@angular/common';
import { Field } from '../models/game-models';

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
