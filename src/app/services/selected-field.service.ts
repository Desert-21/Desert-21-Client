import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Field } from '../models/game-models';
import { FieldSelection } from '../models/game-utility-models';
import { GameStateService } from './http/game-state.service';

@Injectable({
  providedIn: 'root'
})
export class SelectedFieldService {

  constructor(private gameStateService: GameStateService) {
    this.gameStateService.getStateUpdates().subscribe(state => {
      const field = state.fields[this.currentRow][this.currentCol];
      this.pushNextField(field);
    });
  }

  private sub = new Subject<FieldSelection>();
  private currentRow: number = null;
  private currentCol: number = null;

  getSelectedFieldUpdates(): Observable<FieldSelection> {
    return this.sub.asObservable();
  }

  setField(row: number, col: number): void {
    this.currentRow = row;
    this.currentCol = col;
    const state = this.gameStateService.getCurrentState();
    if (state) {
      const field = state.fields[this.currentRow][this.currentCol];
      this.pushNextField(field);
    }
  }

  clearSelection(): void {
    this.currentRow = null;
    this.currentCol = null;
    this.pushNextField(null);
  }

  private pushNextField(field: Field): void {
    this.sub.next({
      row: this.currentRow,
      col: this.currentCol,
      field,
    });
  }

  isCurrentSelection(row: number, col: number): boolean {
    return this.currentRow === row && this.currentCol === col;
  }
}
