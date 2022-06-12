import { Directive, HostListener, Input } from '@angular/core';
import { combineLatest } from 'rxjs';
import { BoardLocation } from '../models/game-models';
import { DirectedLocationPair } from '../models/game-utility-models';
import { DragAndDropFieldsSelectionService } from '../services/rx-logic/drag-and-drop-fields-selection.service';
import { DragAndDropIsOnService } from '../services/rx-logic/drag-and-drop-is-on.service';

@Directive({
  selector: '[appDragAndDropSelection]',
})
export class DragAndDropSelectionDirective {

  @Input() row = -1;
  @Input() col = -1;

  currentSelection: DirectedLocationPair | null = null;
  isOn = false;

  constructor(
    private isOnService: DragAndDropIsOnService,
    private dragAndDropService: DragAndDropFieldsSelectionService
  ) {
    combineLatest([isOnService.getStateUpdates(), dragAndDropService.getStateUpdates()])
    .subscribe(update => {
      const [isOn, selection] = update;
      this.isOn = isOn;
      this.currentSelection = selection;
    });
  }

  @HostListener('mouseenter', ['$event']) onEnter(e: MouseEvent): void {
    if (this.isOn && this.currentSelection !== null) {
      const toLocation: BoardLocation = { row: this.row, col: this.col };
      const fromLocation = this.currentSelection.from;
      this.dragAndDropService.select({
        from: fromLocation,
        to: toLocation
      });
    }
  }

  @HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent): void {
    if (!this.isOn && this.currentSelection === null) {
      const fromLocation: BoardLocation = { row: this.row, col: this.col };
      this.isOnService.setIsOn(true);
      this.dragAndDropService.select({
        from: fromLocation,
        to: fromLocation
      });
    }
  }

  @HostListener('mouseup', ['$event']) onMouseUp(e: MouseEvent): void {
    if (this.isOn && this.currentSelection !== null) {
      this.isOnService.setIsOn(false);
      this.dragAndDropService.unselect();
    }
  }
}
