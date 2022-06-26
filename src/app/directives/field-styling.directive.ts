import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { Field } from '../models/game-models';
import { GameContext } from '../models/game-utility-models';
import { GameContextService } from '../services/rx-logic/shared/game-context.service';
import { MaxPowerService } from '../services/rx-logic/shared/max-power.service';
import { calculateArmyPower } from '../utils/army-power-calculator';

@Directive({
  selector: '[appFieldStyling]',
})
export class FieldStylingDirective implements OnInit, OnDestroy {
  constructor(
    private ref: ElementRef,
    private renderer: Renderer2,
    private contextService: GameContextService,
    private maxPowerService: MaxPowerService
  ) {}

  @Input() row = -1;
  @Input() col = -1;

  field: Field;

  private sub1: Subscription;

  ngOnInit(): void {
    this.sub1 = combineLatest([
      this.contextService.getStateUpdates(),
      this.maxPowerService.getStateUpdates(),
    ]).subscribe((data) => {
      const [context, maxPower] = data;
      const game = context.game;
      this.field = game.fields[this.row][this.col];
      const backgroundColor = this.getBackgroundColorByArmyPower(
        context,
        this.field,
        maxPower
      );
      if (backgroundColor !== null) {
        this.renderer.setStyle(
          this.ref.nativeElement,
          'background-color',
          backgroundColor
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }

  private getBackgroundColorByArmyPower(
    context: GameContext,
    field: Field,
    maxPower: number
  ): string | null {
    if (field.ownerId === null || field.army === null) {
      return null;
    }
    const player = context.game.players.find((p) => field.ownerId === p.id);
    const isHostile = player.id !== context.player.id;
    const armyPower = calculateArmyPower(
      field.army,
      0,
      context.balance,
      player,
      field.building,
      false
    );
    const powerRatio = armyPower / maxPower;
    const opacityRatio = powerRatio * 0.7;
    const red = isHostile ? 255 : 0;
    const green = isHostile ? 0 : 255;
    return `rgba(${red}, ${green}, 0, ${opacityRatio})`;
  }
}
