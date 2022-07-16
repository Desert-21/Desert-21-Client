import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UpgradeAction } from 'src/app/models/actions';
import { CurrentActionsService } from 'src/app/services/rx-logic/shared/current-actions.service';
import {
  UpgradeBuildingInfo,
  UpgradeBuildingInfoService,
} from 'src/app/services/rx-logic/single-field-selection/upgrade-building-info.service';
import { getNotAvailable } from 'src/app/utils/validation';

@Component({
  selector: 'app-upgrade-building-button',
  templateUrl: './upgrade-building-button.component.html',
  styleUrls: ['./upgrade-building-button.component.scss'],
})
export class UpgradeBuildingButtonComponent implements OnInit, OnDestroy {
  upgradeBuildingInfo: UpgradeBuildingInfo = {
    availability: getNotAvailable(''),
    balance: null,
    building: null,
    location: null,
    buildingMaterialsCost: 0,
    shouldShowTheButton: false,
    shouldShowTooltip: false,
  };

  private sub1: Subscription;

  constructor(
    private upgradeBuildingInfoService: UpgradeBuildingInfoService,
    private currentActionsService: CurrentActionsService
  ) {}

  ngOnInit(): void {
    this.sub1 = this.upgradeBuildingInfoService
      .getStateUpdates()
      .subscribe((info) => {
        console.log(info)
        this.upgradeBuildingInfo = info;
      });
    this.upgradeBuildingInfoService.requestState();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }

  upgradeBuilding(): void {
    const action = new UpgradeAction(
      this.upgradeBuildingInfo.buildingMaterialsCost,
      this.upgradeBuildingInfo.location
    );
    this.currentActionsService.pushAction(action);
  }
}
