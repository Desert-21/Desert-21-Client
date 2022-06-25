import { Component, OnInit } from '@angular/core';
import { Army } from 'src/app/models/game-models';
import { FromFieldArmyService } from 'src/app/services/rx-logic/from-field-army.service';
import { ToFieldAttackersService } from 'src/app/services/rx-logic/to-field-attackers.service';

@Component({
  selector: 'app-attack',
  templateUrl: './attack.component.html',
  styleUrls: ['./attack.component.scss'],
})
export class AttackComponent implements OnInit {
  maxArmy: Army = { droids: 0, tanks: 0, cannons: 0 };

  toFieldArmyAfterMovement: Army = { droids: 0, tanks: 0, cannons: 0 };

  toFieldEnemyArmy: Army = { droids: 0, tanks: 0, cannons: 0 };

  constructor(
    private fromFieldArmyService: FromFieldArmyService,
    private toFieldAttackersService: ToFieldAttackersService
  ) {}

  ngOnInit(): void {
    this.fromFieldArmyService.getStateUpdates().subscribe((army) => {
      this.maxArmy = army;
    });
    this.fromFieldArmyService.requestState();
  }

  onArmySelectionChange(army: Army): void {
    this.toFieldArmyAfterMovement = army;
  }
}
