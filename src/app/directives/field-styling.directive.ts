import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { ActionHoverFieldSelection } from '../models/actions';
import { Field } from '../models/game-models';
import { FieldSelection } from '../models/game-utility-models';
import { ActionRelatedLocationsService } from '../services/rx-logic/shared/action-related-locations.service';
import { GameContextService } from '../services/rx-logic/shared/game-context.service';
import { SelectedFieldService } from '../services/rx-logic/single-field-selection/selected-field.service';
import { areLocationsEqual } from '../utils/location-utils';

@Directive({
  selector: '[appFieldStyling]',
})
export class FieldStylingDirective implements OnInit, OnDestroy {
  constructor(
    private ref: ElementRef,
    private renderer: Renderer2,
    private contextService: GameContextService,
    private actionRelatedLocationService: ActionRelatedLocationsService,
    private fieldSelectionService: SelectedFieldService
  ) {}

  @Input() row = -1;
  @Input() col = -1;

  field: Field;

  private sub1: Subscription;

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.contextService.getStateUpdates(),
      this.actionRelatedLocationService.getStateUpdates(),
      this.fieldSelectionService.getStateUpdates(),
    ]).subscribe((data) => {
      const [context, locations, currentFieldSelection] = data;
      const game = context.game;
      this.field = game.fields[this.row][this.col];
      const backgroundColor = this.getBackgroundColor(
        locations,
        currentFieldSelection
      );
      if (backgroundColor !== null) {
        this.renderer.setStyle(
          this.ref.nativeElement,
          'background-color',
          backgroundColor
        );
      } else {
        this.renderer.setStyle(this.ref.nativeElement, 'background-color', '');
      }
    });
    this.actionRelatedLocationService.requestState();
    this.fieldSelectionService.requestState();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }

  private getBackgroundColor(
    actionRelatedSelections: Array<ActionHoverFieldSelection>,
    fieldSelection: FieldSelection
  ): string {
    const byActionRelatedSelections =
      this.getBackgroundColorByActionRelatedSelections(actionRelatedSelections);
    if (byActionRelatedSelections !== null) {
      return byActionRelatedSelections;
    }
    const byFieldSelection =
      this.getBackgroundColorByFieldSelection(fieldSelection);
    if (byFieldSelection !== null) {
      return byFieldSelection;
    }
    return '';
  }

  private getBackgroundColorByActionRelatedSelections(
    selections: Array<ActionHoverFieldSelection>
  ): string | null {
    const optionalSelection = selections.find((s) =>
      areLocationsEqual({ row: this.row, col: this.col }, s.location)
    );
    if (optionalSelection === undefined) {
      return null;
    }
    switch (optionalSelection.type) {
      case 'SOURCE':
        return 'rgb(255, 229, 33)';
      case 'TARGET':
        return 'rgb(212, 34, 6)';
    }
  }

  private getBackgroundColorByFieldSelection(
    selection: FieldSelection | null
  ): string | null {
    if (
      selection === null ||
      !areLocationsEqual({ row: this.row, col: this.col }, selection)
    ) {
      return null;
    }
    return 'rgb(2, 132, 245)';
  }
}
