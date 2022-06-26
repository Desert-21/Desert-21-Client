import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BoardLocation } from 'src/app/models/game-models';
import { RequestableResource } from '../templates/requestable-resource';

@Injectable({
  providedIn: 'root',
})
export class LocationSelectionService
  implements RequestableResource<BoardLocation | null>
{
  private location: BoardLocation | null = null;
  private sub: Subject<BoardLocation | null> = new Subject();

  requestState(): void {
    this.sub.next(this.location);
  }

  getStateUpdates(): Observable<BoardLocation | null> {
    return this.sub.asObservable();
  }

  setLocation(location: BoardLocation | null): void {
    this.location = location;
    this.sub.next(this.location);
  }

  isCurrentSelection(row: number, col: number): boolean {
    if (!this.location) {
      return false;
    }
    return this.location.row === row && this.location.col === col;
  }
}
