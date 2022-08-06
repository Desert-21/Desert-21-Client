import { Component, Input, OnInit } from '@angular/core';
import { FireRocketAction } from 'src/app/models/actions';

@Component({
  selector: 'app-fire-rocket-action-details',
  templateUrl: './fire-rocket-action-details.component.html',
  styleUrls: ['./fire-rocket-action-details.component.scss'],
})
export class FireRocketActionDetailsComponent implements OnInit {
  private _action: FireRocketAction = null;
  isTargetingRocket = false;

  constructor() {}

  ngOnInit(): void {}

  get action(): FireRocketAction {
    return this._action;
  }

  @Input()
  set action(action: FireRocketAction) {
    this.isTargetingRocket = action.isTargetingRocket;
    this._action = action;
  }
}
