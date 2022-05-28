import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GameBalanceConfig } from 'src/app/models/game-config-models';
import { Building, BuildingType, FactoryType } from 'src/app/models/game-models';

@Component({
  selector: 'app-factory-tooltip',
  templateUrl: './factory-tooltip.component.html',
  styleUrls: ['./factory-tooltip.component.scss']
})
export class FactoryTooltipComponent implements OnInit, OnChanges {

  @Input() building: Building | null;
  @Input() balance: GameBalanceConfig | null;

  factoryName = '';
  fromLevel = 0;
  toLevel = 0;
  resourceName = '';
  fromProduction = 0;
  toProduction = 0;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.building === null || this.balance === null) {
      this.factoryName = '';
      this.fromLevel = 0;
      this.toLevel = 0;
      this.resourceName = '';
      this.fromProduction = 0;
      this.toProduction = 0;
      return;
    }
    const factoryType = this.building.type as FactoryType;
    this.factoryName = this.getFactoryName(factoryType);
    this.resourceName = this.getResourceName(factoryType);

    this.fromLevel = this.building.level;
    this.toLevel = this.fromLevel + 1;

    this.setFromAndToProduction();
  }

  getFactoryName(type: FactoryType): string {
    switch (type) {
      case 'METAL_FACTORY':
        return 'Metal Factory';
      case 'BUILDING_MATERIALS_FACTORY':
        return 'Building Materials Factory';
      case 'ELECTRICITY_FACTORY':
        return 'Electricity Factory';
    }
  }

  getResourceName(type: FactoryType): string {
    switch (type) {
      case 'METAL_FACTORY':
        return 'metal';
      case 'BUILDING_MATERIALS_FACTORY':
        return 'building materials';
      case 'ELECTRICITY_FACTORY':
        return 'electricity';
    }
  }

  setFromAndToProduction(): void {
    const factoryBalance = this.balance.buildings.factory;
    const productionBalance = factoryBalance.production;
    console.log(productionBalance, this.building.level);
    switch (this.building.level) {
      case 1:
        this.fromProduction = productionBalance.level1;
        this.toProduction = productionBalance.level2;
        break;
      case 2:
        this.fromProduction = productionBalance.level2;
        this.toProduction = productionBalance.level3;
        break;
      case 3:
        this.fromProduction = productionBalance.level3;
        this.toProduction = productionBalance.level4;
        break;
      default:
        this.fromProduction = 0;
        this.fromProduction = 0;
    }
  }
}
