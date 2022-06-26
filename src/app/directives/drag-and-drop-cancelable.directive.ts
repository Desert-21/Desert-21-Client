import { Directive, HostListener, OnDestroy } from '@angular/core';
import { DirectedLocationPair } from '../models/game-utility-models';
import { DragAndDropFieldsSelectionService } from '../services/rx-logic/double-field-selection/drag-and-drop/drag-and-drop-fields-selection.service';
import { DragAndDropIsOnService } from '../services/rx-logic/double-field-selection/drag-and-drop/drag-and-drop-is-on.service';
import { combineLatest, Subscription } from 'rxjs';

@Directive({
  selector: '[appDragAndDropCancelable]',
})
export class DragAndDropCancelableDirective implements OnDestroy {

  isOn = false;

  private sub1: Subscription;

  constructor(
    private isOnService: DragAndDropIsOnService,
    private dragAndDropService: DragAndDropFieldsSelectionService
  ) {
    this.sub1 = this.isOnService.getStateUpdates().subscribe(isOn => {
      this.isOn = isOn;
    });
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }

  @HostListener('mouseleave', ['$event']) onLeave(e: MouseEvent): void {
    if (this.isOn) {
      this.isOnService.setIsOn(false);
      this.dragAndDropService.unselect();
    }
  }
}
