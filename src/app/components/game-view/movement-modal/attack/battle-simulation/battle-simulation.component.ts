import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, debounceTime, Subscription } from 'rxjs';
import { BattleResult } from 'src/app/models/notification-models';
import { BattleSimulationService } from 'src/app/services/rx-logic/double-field-selection/army-movements/battle-simulation.service';
import { SimulatorLuckSelectorService } from 'src/app/services/rx-logic/double-field-selection/army-movements/simulator-luck-selector.service';

@Component({
  selector: 'app-battle-simulation',
  templateUrl: './battle-simulation.component.html',
  styleUrls: ['./battle-simulation.component.scss'],
})
export class BattleSimulationComponent implements OnInit, OnDestroy {
  battleResult: BattleResult = {
    attackersBefore: { droids: 0, tanks: 0, cannons: 0, scarabs: 0 },
    defendersBefore: { droids: 0, tanks: 0, cannons: 0, scarabs: 0 },
    attackersAfter: { droids: 0, tanks: 0, cannons: 0, scarabs: 0 },
    defendersAfter: { droids: 0, tanks: 0, cannons: 0, scarabs: 0 },
    haveAttackersWon: false,
    wasUnoccupied: false,
  };

  constructor(
    private luckSelectorService: SimulatorLuckSelectorService,
    private battleSimulationService: BattleSimulationService
  ) {}

  sub1: Subscription;

  ngOnInit(): void {
    this.sub1 = this.battleSimulationService
      .getStateUpdates()
      .subscribe((battleResult) => {
        this.battleResult = battleResult;
      });
    this.battleSimulationService.requestState();
  }

  onRangeSelectionChange(event: any): void {
    const luck = event.target.value;
    this.luckSelectorService.set(luck);
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
