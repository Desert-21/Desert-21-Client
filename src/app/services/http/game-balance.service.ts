import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameBalanceConfig } from 'src/app/models/game-config-models';
import { GenericHttpService } from './generic-http-service';

@Injectable({
  providedIn: 'root',
})
export class GameBalanceService extends GenericHttpService<GameBalanceConfig> {

  constructor(private http: HttpClient) {
    super();
  }

  protected callHttp(): Observable<GameBalanceConfig> {
    return this.http.get<GameBalanceConfig>('/balance');
  }
}
