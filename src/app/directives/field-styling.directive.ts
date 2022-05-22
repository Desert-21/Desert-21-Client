import {
  AfterViewChecked,
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';
import { combineLatestWith } from 'rxjs';
import { Field } from '../models/game-models';
import { GameStateService } from '../services/http/game-state.service';
import { UserInfoService } from '../services/http/user-info.service';

// to be removed?
@Directive({
  selector: '[appFieldStyling]',
})
export class FieldStylingDirective implements AfterViewChecked {
  constructor(
    private ref: ElementRef,
    private renderer: Renderer2,
    private gameStateService: GameStateService,
    private userInfoService: UserInfoService
  ) {}

  @Input() row = -1;
  @Input() col = -1;

  field: Field;

  @HostListener('mouseenter', ['$event']) onEnter(e: MouseEvent): void {
    this.renderer.addClass(this.ref.nativeElement, 'owned');
  }

  ngAfterViewChecked(): void {
    this.gameStateService
      .getStateUpdates()
      .pipe(combineLatestWith(this.userInfoService.getStateUpdates()))
      .subscribe((gameWithUsersData) => {
        const game = gameWithUsersData[0];
        const usersData = gameWithUsersData[1];
        const usersId = usersData.id;
        this.field = game.fields[this.row][this.col];
        const isOwned = this.field.ownerId === usersId;
        console.log('INVOKING!');
        this.renderer.addClass(this.ref.nativeElement, 'owned');
        if (isOwned) {
          this.renderer.setStyle(this.ref.nativeElement, 'color', 'blue');
        }
      });
  }
}
