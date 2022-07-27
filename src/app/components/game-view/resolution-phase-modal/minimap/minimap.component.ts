import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { Field } from 'src/app/models/game-models';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import { flattenFields } from 'src/app/utils/location-utils';

@Component({
  selector: 'app-minimap',
  templateUrl: './minimap.component.html',
  styleUrls: ['./minimap.component.scss'],
})
export class MinimapComponent implements OnInit, OnDestroy {
  fields: Array<Array<Field>> = [];

  sub1: Subscription;

  constructor(private gameContextService: GameContextService) {}

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.gameContextService.getStateUpdates(),
    ]).subscribe(([context]) => {
      this.fields = context.game.fields;
    });
    this.gameContextService.requestState();
  }

  trackBy(index: any, item: any): number {
    return index;
  }

  ngOnDestroy(): void {
    this.gameContextService.requestState();
  }
}
