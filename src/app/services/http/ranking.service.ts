import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericHttpService } from './generic-http-service';

export type RankingEntry = {
  id: string;
  nickname: string;
  ranking: number;
};

@Injectable({
  providedIn: 'root',
})
export class RankingService extends GenericHttpService<Array<RankingEntry>> {
  constructor(private http: HttpClient) {
    super();
  }

  protected callHttp(...args: any[]): Observable<RankingEntry[]> {
    return this.http.get<RankingEntry[]>('/ranking');
  }
}
