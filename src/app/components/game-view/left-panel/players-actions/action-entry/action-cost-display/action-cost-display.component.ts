import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlayersAction } from 'src/app/models/actions';
import { ResourceSet } from 'src/app/models/game-models';
import { camelCaseToCapsLock, camelCaseToKebabCase } from 'src/app/utils/text-utils';

type Resource = keyof ResourceSet;

@Component({
  selector: 'app-action-cost-display',
  templateUrl: './action-cost-display.component.html',
  styleUrls: ['./action-cost-display.component.scss'],
})
export class ActionCostDisplayComponent implements OnInit {
  private actionSubject = new BehaviorSubject<PlayersAction<any>>(null);

  resource: Resource | null = null;
  amount: number | null = null;

  imageSource = '';

  constructor() {}

  ngOnInit(): void {
    this.actionSubject.subscribe((action) => {
      const cost = action.getCost();
      this.enrichResourceAndAmount(cost);
      this.imageSource = `/assets/resources/${camelCaseToKebabCase(this.resource)}.png`;
    });
  }

  private enrichResourceAndAmount(cost: ResourceSet): void {
    for (const [resource, amount] of Object.entries(cost)) {
      if (amount > 0) {
        this.resource = resource as Resource;
        this.amount = amount;
        return;
      }
    }
    this.resource = null;
    this.amount = null;
  }

  get action(): PlayersAction<any> {
    return this.actionSubject.getValue();
  }

  @Input()
  set action(action: PlayersAction<any>) {
    this.actionSubject.next(action);
  }
}
