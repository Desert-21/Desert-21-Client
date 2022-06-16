import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Army, BoardLocation } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import { GameContextService } from 'src/app/services/rx-logic/game-context.service';
import { LastShortestPathCalculationService } from 'src/app/services/rx-logic/last-shortest-path-calculation.service';
import { calculateArmyPower } from 'src/app/utils/army-power-calculator';
import { findByFieldLocation } from 'src/app/utils/location-utils';

@Component({
  selector: 'app-army-destination-preview',
  templateUrl: './army-destination-preview.component.html',
  styleUrls: ['./army-destination-preview.component.scss'],
})
export class ArmyDestinationPreviewComponent implements OnInit, OnChanges {
  @Input() army: Army = { droids: 0, tanks: 0, cannons: 0 };

  @Input() showAttackingPower = false;
  @Input() showDefendingPower = false;

  location: BoardLocation | null = null;

  context: GameContext | null = null;

  defendingArmyPower = 0;

  constructor(
    private gameContextService: GameContextService,
    private lastShortestPathService: LastShortestPathCalculationService
  ) {}

  ngOnInit(): void {
    this.gameContextService.getStateUpdates().subscribe(context => {
      this.context = context;
      this.ngOnChanges(null);
    });
    this.lastShortestPathService.getStateUpdates().subscribe(path => {
      if (path === null || path.length < 2) {
        this.location = null;
        return;
      }
      this.location = path[path.length - 1];
      this.ngOnChanges(null);
    });
    this.gameContextService.requestState();
    this.lastShortestPathService.requestState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.army);
    if (this.context === null || this.location === null) {
      console.log('HERE!');
      this.defendingArmyPower = 0;
      return;
    }
    const field = findByFieldLocation(
      this.location.row,
      this.location.col,
      this.context.game.fields
    );
    const fieldOwner = this.context.game.players.find(p => p.id === field.ownerId);
    const defendingArmyPower = calculateArmyPower(
      this.army,
      this.context.balance,
      fieldOwner,
      field.building,
      true
    );
    this.defendingArmyPower = defendingArmyPower;
  }
}
