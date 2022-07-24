import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { ToFieldDefendersService } from 'src/app/services/rx-logic/double-field-selection/army-movements/to-field-defenders.service';
import { GameContextService } from 'src/app/services/rx-logic/shared/game-context.service';
import { damageArmyByRocket } from 'src/app/utils/battles';
import { ArmyDescription } from '../../../right-panel/army-preview/army-preview-state';

@Component({
  selector: 'app-rocket-damage-estimation',
  templateUrl: './rocket-damage-estimation.component.html',
  styleUrls: ['./rocket-damage-estimation.component.scss'],
})
export class RocketDamageEstimationComponent implements OnInit, OnDestroy {
  armyDescriptionBefore: ArmyDescription = {
    droids: '?',
    tanks: '?',
    cannons: '?',
  };
  armyDescriptionAfter: ArmyDescription = {
    droids: '?',
    tanks: '?',
    cannons: '?',
  };

  sub1: Subscription;

  constructor(
    private armyBeforeStrikeService: ToFieldDefendersService,
    private gameContextService: GameContextService
  ) {}

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.armyBeforeStrikeService.getStateUpdates(),
      this.gameContextService.getStateUpdates(),
    ]).subscribe(([estimatedArmy, context]) => {
      if (estimatedArmy === null) {
        return;
      }
      const damaged = damageArmyByRocket(estimatedArmy, context.balance);
      this.armyDescriptionBefore = estimatedArmy.toStringDescription();
      this.armyDescriptionAfter = damaged.toStringDescription();
    });
    this.armyBeforeStrikeService.requestState();
    this.gameContextService.requestState();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
