import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  AllUpgradesBalance,
  CombatBranchConfig,
  ControlBranchConfig,
  ProductionBranchConfig,
} from 'src/app/models/game-config-models';
import { LabUpgrade } from 'src/app/models/game-models';
import { GameBalanceService } from 'src/app/services/http/game-balance.service';

@Component({
  selector: 'app-upgrade-description',
  templateUrl: './upgrade-description.component.html',
  styleUrls: ['./upgrade-description.component.scss'],
})
export class UpgradeDescriptionComponent implements OnInit, OnDestroy {
  constructor(private gameBalanceService: GameBalanceService) {}

  @Input()
  upgrade: LabUpgrade;

  combat: CombatBranchConfig;
  control: ControlBranchConfig;
  production: ProductionBranchConfig;

  sub1: Subscription;

  ngOnInit(): void {
    this.sub1 = this.gameBalanceService
      .getStateUpdates()
      .subscribe((config) => {
        this.combat = config.upgrades.combat.balanceConfig;
        this.control = config.upgrades.control.balanceConfig;
        this.production = config.upgrades.production.balanceConfig;
      });
    this.gameBalanceService.requestState();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
