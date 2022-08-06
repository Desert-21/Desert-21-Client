import { Component, Input, OnInit } from '@angular/core';
import { LabAction } from 'src/app/models/actions';
import { labUpgradeToImagePath } from 'src/app/utils/lab-utils';

@Component({
  selector: 'app-lab-action-details',
  templateUrl: './lab-action-details.component.html',
  styleUrls: ['./lab-action-details.component.scss'],
})
export class LabActionDetailsComponent implements OnInit {
  private _action: LabAction = null;

  imageSource = '';

  constructor() {}

  ngOnInit(): void {}

  get action(): LabAction {
    return this._action;
  }

  @Input()
  set action(action: LabAction) {
    this.imageSource = labUpgradeToImagePath(action.upgrade);
    this._action = action;
  }
}
