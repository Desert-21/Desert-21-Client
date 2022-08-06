import { Component, Input, OnInit } from '@angular/core';
import { TrainAction } from 'src/app/models/actions';
import { getUnitImage } from 'src/app/utils/army-utils';

@Component({
  selector: 'app-train-action-details',
  templateUrl: './train-action-details.component.html',
  styleUrls: ['./train-action-details.component.scss']
})
export class TrainActionDetailsComponent implements OnInit {

  private _action: TrainAction = null;

  unitImage = '';
  amount = 0;

  constructor() { }

  ngOnInit(): void {
  }

  get action(): TrainAction {
    return this._action;
  }

  @Input()
  set action(action: TrainAction) {
    this.unitImage = getUnitImage(action.unitType);
    this.amount = action.amount;
    this._action = action;
  }
}
