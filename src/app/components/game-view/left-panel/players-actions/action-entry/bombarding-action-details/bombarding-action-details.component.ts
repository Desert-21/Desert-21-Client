import { Component, Input, OnInit } from '@angular/core';
import { BombardAction } from 'src/app/models/actions';

@Component({
  selector: 'app-bombarding-action-details',
  templateUrl: './bombarding-action-details.component.html',
  styleUrls: ['./bombarding-action-details.component.scss']
})
export class BombardingActionDetailsComponent implements OnInit {

  private _action: BombardAction = null;
  cannonsAmount = 0;

  constructor() { }

  ngOnInit(): void {
  }

  get action(): BombardAction {
    return this._action;
  }

  @Input()
  set action(action: BombardAction) {
    this.cannonsAmount = action.cannonsAmount;
    this._action = action;
  }
}
