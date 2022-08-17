import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { PlayersAction, UpgradeAction } from 'src/app/models/actions';
import { Field } from 'src/app/models/game-models';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import { getBuildingImage } from 'src/app/utils/building-utils';
import { findByFieldLocation } from 'src/app/utils/location-utils';

@Component({
  selector: 'app-upgrade-action-details',
  templateUrl: './upgrade-action-details.component.html',
  styleUrls: ['./upgrade-action-details.component.scss'],
})
export class UpgradeActionDetailsComponent implements OnInit, OnDestroy {
  private actionSubject = new BehaviorSubject<UpgradeAction>(null);

  levelFrom: number = null;
  levelTo: number = null;
  imageFrom = '';
  imageTo = '';

  private sub1: Subscription;

  constructor(private gameContextService: GameContextService) {}

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.actionSubject.asObservable(),
      this.gameContextService.getStateUpdates(),
    ]).subscribe(([action, context]) => {
      const field = findByFieldLocation(action.location, context.game.fields);
      this.enrichLevelingInfo(field);
    });
    this.gameContextService.requestState();
  }

  private enrichLevelingInfo(field: Field): void {
    const building = field.building;
    this.levelFrom = building.level;
    this.levelTo = building.level + 1;
    this.imageFrom = getBuildingImage(building.type, this.levelFrom);
    this.imageTo = getBuildingImage(building.type, this.levelTo);
  }

  get action(): UpgradeAction {
    return this.actionSubject.getValue();
  }

  @Input()
  set action(action: UpgradeAction) {
    this.actionSubject.next(action);
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
