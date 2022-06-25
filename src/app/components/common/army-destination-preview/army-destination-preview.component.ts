import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Army } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import {
  DoubleFieldSelection,
  DoubleFieldSelectionService,
} from 'src/app/services/rx-logic/double-field-selection.service';
import { GameContextService } from 'src/app/services/rx-logic/game-context.service';
import { calculateArmyPower } from 'src/app/utils/army-power-calculator';

@Component({
  selector: 'app-army-destination-preview',
  templateUrl: './army-destination-preview.component.html',
  styleUrls: ['./army-destination-preview.component.scss'],
})
export class ArmyDestinationPreviewComponent implements OnInit, OnChanges, OnDestroy {
  @Input() army: Army = { droids: 0, tanks: 0, cannons: 0 };

  @Input() showAttackingPower = false;
  @Input() showDefendingPower = false;

  fieldSelection: DoubleFieldSelection | null = null;

  context: GameContext | null = null;

  defendingArmyPower = 0;

  private sub1: Subscription;
  private sub2: Subscription;

  constructor(
    private gameContextService: GameContextService,
    private fieldSelectionService: DoubleFieldSelectionService
  ) {}

  ngOnInit(): void {
    this.sub1 = this.gameContextService.getStateUpdates().subscribe((context) => {
      this.context = context;
      this.ngOnChanges(null);
    });
    this.sub2 = this.fieldSelectionService.getStateUpdates().subscribe((selection) => {
      if (selection === null) {
        this.fieldSelection = null;
        return;
      }
      this.fieldSelection = selection;
      this.ngOnChanges(null);
    });
    this.gameContextService.requestState();
    this.fieldSelectionService.requestState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.context === null || this.fieldSelection === null) {
      this.defendingArmyPower = 0;
      return;
    }
    const field = this.fieldSelection.to.field;
    const fieldOwner = this.context.game.players.find(
      (p) => p.id === field.ownerId
    );
    this.defendingArmyPower = calculateArmyPower(
      this.army,
      0,
      this.context.balance,
      fieldOwner,
      field.building,
      true
    );
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }
}
