import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { ActionHoverFieldSelection } from 'src/app/models/actions';
import { BoardLocation } from 'src/app/models/game-models';
import { FieldSelection } from 'src/app/models/game-utility-models';
import { ActionRelatedLocationsService } from 'src/app/services/rx-logic/shared/action-related-locations.service';
import { SelectedFieldService } from 'src/app/services/rx-logic/single-field-selection/selected-field.service';
import { areLocationsEqual } from 'src/app/utils/location-utils';

type EnlightmentType = 'SELECTION' | 'SOURCE' | 'DESTINATION' | 'NONE';

@Component({
  selector: 'app-field-marker',
  templateUrl: './field-marker.component.html',
  styleUrls: ['./field-marker.component.scss'],
})
export class FieldMarkerComponent implements OnInit, OnDestroy {
  constructor(
    private actionRelatedLocationService: ActionRelatedLocationsService,
    private fieldSelectionService: SelectedFieldService
  ) {
    this.sub1 = combineLatest([
      this.actionRelatedLocationService.getStateUpdates(),
      this.fieldSelectionService.getStateUpdates(),
      this.fieldLocationSubject.asObservable(),
    ]).subscribe((data) => {
      const [locations, currentFieldSelection, fieldLocation] = data;
      this.currentFieldLocation = fieldLocation;
      this.enlightmentType = this.getEnlightmentType(
        locations,
        currentFieldSelection
      );
    });
    this.actionRelatedLocationService.requestState();
    this.fieldSelectionService.requestState();
  }

  fieldLocationSubject = new Subject<BoardLocation>();
  currentFieldLocation: BoardLocation = { row: 0, col: 0 };
  enlightmentType: EnlightmentType = 'NONE';

  private sub1: Subscription;

  ngOnInit(): void {}

  private getEnlightmentType(
    actionRelatedSelections: Array<ActionHoverFieldSelection>,
    fieldSelection: FieldSelection
  ): EnlightmentType {
    const byActionRelatedSelections =
      this.getEnlightmentTypeByActionRelatedSelections(actionRelatedSelections);
    if (byActionRelatedSelections !== null) {
      return byActionRelatedSelections;
    }
    const byFieldSelection =
      this.getEnlightmentTypeByFieldSelection(fieldSelection);
    if (byFieldSelection !== null) {
      return byFieldSelection;
    }
    return 'NONE';
  }

  private getEnlightmentTypeByActionRelatedSelections(
    selections: Array<ActionHoverFieldSelection>
  ): EnlightmentType | null {
    const optionalSelection = selections.find((s) =>
      areLocationsEqual(this.currentFieldLocation, s.location)
    );
    if (optionalSelection === undefined) {
      return null;
    }
    switch (optionalSelection.type) {
      case 'SOURCE':
        return 'SOURCE';
      case 'TARGET':
        return 'DESTINATION';
    }
  }

  private getEnlightmentTypeByFieldSelection(
    selection: FieldSelection | null
  ): EnlightmentType | null {
    if (
      selection === null ||
      !areLocationsEqual(this.currentFieldLocation, selection)
    ) {
      return null;
    }
    return 'SELECTION';
  }

  @Input()
  set fieldLocation(location: BoardLocation) {
    this.fieldLocationSubject.next(location);
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
