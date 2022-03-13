import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Game } from '../../models/game-models';
import { GameIdService } from '../game-id.service';
import { GenericHttpService } from './generic-http-service';

@Injectable({
  providedIn: 'root',
})
export class GameStateService extends GenericHttpService<Game> {
  constructor(private http: HttpClient, private gameIdService: GameIdService) {
    super();
  }

  protected callHttp(): Observable<Game> {
    const gameId = this.gameIdService.getId();
    return this.http.get<Game>(`/games/snapshots/${gameId}`);
  }
}
