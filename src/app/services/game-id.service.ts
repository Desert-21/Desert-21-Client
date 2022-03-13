import { Injectable } from '@angular/core';

const GAME_ID_LOCATION = "desert-21-game-id";

@Injectable({
  providedIn: 'root'
})
export class GameIdService {

  saveId(id: string) {
    localStorage.setItem(GAME_ID_LOCATION, id);
  }

  getId(): string {
    return localStorage.getItem(GAME_ID_LOCATION);
  }
}
