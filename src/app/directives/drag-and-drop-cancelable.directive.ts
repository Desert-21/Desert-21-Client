import { Directive, HostListener } from '@angular/core';
import { DirectedLocationPair } from '../models/game-utility-models';
import { DragAndDropFieldsSelectionService } from '../services/rx-logic/drag-and-drop-fields-selection.service';
import { DragAndDropIsOnService } from '../services/rx-logic/drag-and-drop-is-on.service';
import { combineLatest } from 'rxjs';

@Directive({
  selector: '[appDragAndDropCancelable]',
})
export class DragAndDropCancelableDirective {

  isOn = false;

  constructor(
    private isOnService: DragAndDropIsOnService,
    private dragAndDropService: DragAndDropFieldsSelectionService
  ) {
    this.isOnService.getStateUpdates().subscribe(isOn => {
      this.isOn = isOn;
    });
  }

  @HostListener('mouseleave', ['$event']) onLeave(e: MouseEvent): void {
    if (this.isOn) {
      this.isOnService.setIsOn(false);
      this.dragAndDropService.unselect();
    }
  }
}
