import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Game } from '../models/game-models';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  constructor(private http: HttpClient) { }

  private isFetched: boolean = false;
  private gameState: Game = null;
  private gameStateSub = new Subject<Game>();

  getGameStateUpdates(): Observable<Game> {
    return this.gameStateSub.asObservable();
  }

  requestGameState(): void {
    if (this.gameState !== null) {
      this.gameStateSub.next(this.gameState);
      return;
    }
    if (this.isFetched) {
      return;
    }
    this.fetchGameState();
  }

  fetchGameState(): void {
    this.isFetched = true;
    this.http.get<Game>('/gameGenerator').subscribe(resp => {
      this.gameState = resp;
      this.gameStateSub.next(resp);
      this.isFetched = false;
    });
  }

  currentState(): Game | null {
    return this.gameState;
  }

  updateGameState(game: Game): void {
    this.gameState = game;
    this.gameStateSub.next(game);
  }
}
