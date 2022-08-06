import { Component, Input, OnInit } from '@angular/core';
import { BuildBuildingAction } from 'src/app/models/actions';
import { getBuildingImage } from 'src/app/utils/building-utils';

@Component({
  selector: 'app-build-action-details',
  templateUrl: './build-action-details.component.html',
  styleUrls: ['./build-action-details.component.scss'],
})
export class BuildActionDetailsComponent implements OnInit {
  private _action: BuildBuildingAction = null;
  imageTo = '';

  constructor() {}

  ngOnInit(): void {}

  get action(): BuildBuildingAction {
    return this._action;
  }

  @Input()
  set action(action: BuildBuildingAction) {
    this.imageTo = getBuildingImage(action.buildingType, 1);
    this._action = action;
  }
}
