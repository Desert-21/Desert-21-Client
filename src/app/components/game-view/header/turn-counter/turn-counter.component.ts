import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameStateService } from 'src/app/services/http/game-state.service';

@Component({
  selector: 'app-turn-counter',
  templateUrl: './turn-counter.component.html',
  styleUrls: ['./turn-counter.component.scss'],
})
export class TurnCounterComponent implements OnInit, OnDestroy {
  counter = 0;
  private sub1: Subscription;

  constructor(private gameStateService: GameStateService) {}

  ngOnInit(): void {
    this.sub1 = this.gameStateService.getStateUpdates().subscribe((counter) => {
      this.counter = counter.stateManager.turnCounter;
    });
    this.gameStateService.requestState();
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }
}
