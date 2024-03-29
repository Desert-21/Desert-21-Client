import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameStateService } from 'src/app/services/http/game-state.service';
import {
  FieldLinking,
  FieldLinkingService,
} from 'src/app/services/rx-logic/double-field-selection/drag-and-drop/field-linking.service';
import { generateEmptyTable } from 'src/app/utils/location-utils';
import { Field } from '../../../models/game-models';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss'],
})
export class AreasComponent implements OnInit, OnDestroy {
  myColor = 'rgba(0, 255, 0, 1.0)';
  player1Color = 'rgba(255, 255, 0, 0.3)';
  player2Color = 'rgba(255, 70, 0, 0.3)';
  player3Color = 'rgba(210, 70, 140, 0.3)';
  player4Color = 'rgba(180, 0, 0, 0.3)';

  numbers: Array<number>;

  fieldLinking: FieldLinking = {
    horizontal: generateEmptyTable(7, 7),
    vertical: generateEmptyTable(7, 7),
  };

  private sub1: Subscription;
  private sub2: Subscription;

  constructor(
    private gameService: GameStateService,
    private fieldLinkingService: FieldLinkingService
  ) {
    this.numbers = [0, 1, 2, 3, 4, 5, 6];
  }

  fields: Array<Array<Field>>;

  initFields(): void {
    this.fields = [];
    for (let i = 0; i < 7; i++) {
      this.fields.push([]);
      for (let j = 0; j < 7; j++) {
        const field: Field = {
          building: {
            type: 'EMPTY_FIELD',
            level: 0,
          },
          ownerId: '',
          army: {
            droids: 0,
            tanks: 0,
            cannons: 0,
          },
        };
        this.fields[i].push(field);
      }
    }
  }

  ngOnInit(): void {
    this.initFields();
    this.sub1 = this.gameService
      .getStateUpdates()
      .subscribe((resp) => (this.fields = resp.fields));
    this.sub2 = this.fieldLinkingService
      .getStateUpdates()
      .subscribe((linking) => {
        this.fieldLinking = linking;
      });
    this.gameService.requestState();
    this.fieldLinkingService.requestState();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

  isLinkableVertically(row, col): boolean {
    return row < 10;
  }

  isLinkableHorizontally(row, col): boolean {
    return col < 10;
  }

  getBackground(): string {
    return 'url(\'assets/game-graphics/backgrounds/game-background.jpg\')';
  }

  trackBy(index: any, item: any): number {
    return index;
  }
}
