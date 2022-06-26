import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Army, UnitType } from 'src/app/models/game-models';
import { UnitsMovementAvailabilityService } from 'src/app/services/rx-logic/double-field-selection/army-movements/units-movement-availability.service';

@Component({
  selector: 'app-army-picker',
  templateUrl: './army-picker.component.html',
  styleUrls: ['./army-picker.component.scss'],
})
export class ArmyPickerComponent implements OnInit, OnDestroy {
  @Input() maxArmy: Army = { droids: 0, tanks: 0, cannons: 0 };

  @Output() armySelectionChanges: EventEmitter<Army> = new EventEmitter<Army>();

  private droidsField = 0;
  private tanksField = 0;
  private cannonsField = 0;

  private armySelection: Army = { droids: 0, tanks: 0, cannons: 0 };

  unitsAvailability: [boolean, boolean, boolean] = [false, false, false];

  private sub1: Subscription;

  constructor(private unitAvailablityService: UnitsMovementAvailabilityService) {}

  ngOnInit(): void {
    this.sub1 = this.unitAvailablityService.getStateUpdates().subscribe(availability => {
      this.unitsAvailability = availability;
    });
    this.unitAvailablityService.requestState();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }

  updateArmySelection(unitType: UnitType, amount: number): void {
    switch (unitType) {
      case 'DROID':
        this.armySelection.droids = amount;
        break;
      case 'TANK':
        this.armySelection.tanks = amount;
        break;
      case 'CANNON':
        this.armySelection.cannons = amount;
        break;
    }
    this.armySelectionChanges.emit(this.armySelection);
  }

  selectMax(unitType: UnitType): void {
    switch (unitType) {
      case 'DROID':
        this.droids = this.maxArmy.droids;
        break;
      case 'TANK':
        this.tanks = this.maxArmy.tanks;
        break;
      case 'CANNON':
        this.cannons = this.maxArmy.cannons;
        break;
    }
  }

  get droids(): number {
    return this.droidsField;
  }

  set droids(droids: number) {
    this.droidsField = droids;
    this.updateArmySelection('DROID', droids);
  }

  get tanks(): number {
    return this.tanksField;
  }

  set tanks(tanks: number) {
    this.tanksField = tanks;
    this.updateArmySelection('TANK', tanks);
  }

  get cannons(): number {
    return this.cannonsField;
  }

  set cannons(cannons: number) {
    this.cannonsField = cannons;
    this.updateArmySelection('CANNON', cannons);
  }
}
