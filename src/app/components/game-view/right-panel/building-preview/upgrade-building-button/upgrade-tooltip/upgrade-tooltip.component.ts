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
  isFactory = false;
  isTower = false;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.buildingType = this.building.type;
    this.isFactory = this.getIsFactory(this.buildingType);
    this.isTower = this.getIsTower(this.buildingType);
  }

  getIsFactory(buildingType: BuildingType): boolean {
    return (
      buildingType === 'METAL_FACTORY' ||
      buildingType === 'BUILDING_MATERIALS_FACTORY' ||
      buildingType === 'ELECTRICITY_FACTORY'
    );
  }

  getIsTower(buildingType: BuildingType): boolean {
    return buildingType === 'HOME_BASE' || buildingType === 'TOWER';
  }
}
