import { Directive, HostListener, Input, OnDestroy } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { BoardLocation } from '../models/game-models';
import { DirectedLocationPair } from '../models/game-utility-models';
import { DragAndDropFieldsSelectionService } from '../services/rx-logic/drag-and-drop-fields-selection.service';
import { DragAndDropIsOnService } from '../services/rx-logic/drag-and-drop-is-on.service';
import { GameModalService } from '../services/rx-logic/game-modal.service';
import { LastShortestPathCalculationService } from '../services/rx-logic/last-shortest-path-calculation.service';
import { areLocationsEqual } from '../utils/location-utils';

@Directive({
  selector: '[appDragAndDropSelection]',
})
export class DragAndDropSelectionDirective implements OnDestroy {
  @Input() row = -1;
  @Input() col = -1;

  currentSelection: DirectedLocationPair | null = null;
  isOn = false;

  private sub1: Subscription;

  constructor(
    private isOnService: DragAndDropIsOnService,
    private dragAndDropService: DragAndDropFieldsSelectionService,
    private gameModalService: GameModalService,
    private lastShortestPathService: LastShortestPathCalculationService
  ) {
    this.sub1 = combineLatest([
      isOnService.getStateUpdates(),
      dragAndDropService.getStateUpdates(),
    ]).subscribe((update) => {
      const [isOn, selection] = update;
      this.isOn = isOn;
      this.currentSelection = selection;
    });
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }

  @HostListener('mouseenter', ['$event']) onEnter(e: MouseEvent): void {
    if (this.isOn && this.currentSelection !== null) {
      const toLocation: BoardLocation = { row: this.row, col: this.col };
      const fromLocation = this.currentSelection.from;
      this.dragAndDropService.select({
        from: fromLocation,
        to: toLocation,
      });
    }
  }

  @HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent): void {
    if (!this.isOn && this.currentSelection === null) {
      this.lastShortestPathService.clearData();
      const fromLocation: BoardLocation = { row: this.row, col: this.col };
      this.isOnService.setIsOn(true);
      this.dragAndDropService.select({
        from: fromLocation,
        to: fromLocation,
      });
    }
  }

  @HostListener('mouseup', ['$event']) onMouseUp(e: MouseEvent): void {
    if (!this.isOn) {
      return;
    }
    if (this.currentSelection === null) {
      return;
    }
    if (
      this.currentSelection.to !== null &&
      this.currentSelection.from !== null &&
      !areLocationsEqual(this.currentSelection.from, this.currentSelection.to)
    ) {
      this.gameModalService.openModal('MOVEMENT');
    }
    this.isOnService.setIsOn(false);
    this.dragAndDropService.unselect();
  }
}
