import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { GameBalanceConfig } from 'src/app/models/game-config-models';
import { Building, BuildingType } from 'src/app/models/game-models';

@Component({
  selector: 'app-upgrade-tooltip',
  templateUrl: './upgrade-tooltip.component.html',
  styleUrls: ['./upgrade-tooltip.component.scss'],
})
export class UpgradeTooltipComponent implements OnInit, OnChanges {
  @Input() balance: GameBalanceConfig | null;
  @Input() building: Building | null;

  buildingType: BuildingType = 'EMPTY_FIELD';

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.buildingType = this.building.type;
  }

  isFactory(): boolean {
    return (
      this.buildingType === 'METAL_FACTORY' ||
      this.buildingType === 'BUILDING_MATERIALS_FACTORY' ||
      this.buildingType === 'ELECTRICITY_FACTORY'
    );
  }

  isTower(): boolean {
    return this.buildingType === 'HOME_BASE' || this.buildingType === 'TOWER';
  }
}
