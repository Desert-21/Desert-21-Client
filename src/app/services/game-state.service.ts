import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Game } from '../models/game-models';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  constructor(private http: HttpClient) { }

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
    this.fetchGameState();
  }

  private fetchGameState(): void {
    this.http.get<Game>('/gameGenerator').subscribe(resp => {
      this.gameState = resp;
      this.gameStateSub.next(resp);
    })
  }
}
