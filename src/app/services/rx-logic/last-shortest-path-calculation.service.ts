import { Injectable } from '@angular/core';
import { BoardLocation } from 'src/app/models/game-models';
import { ResourceProcessor } from './resource-processor';
import { ShortestPathCalculatorService } from './shortest-path-calculator.service';

@Injectable({
  providedIn: 'root',
})
export class LastShortestPathCalculationService extends ResourceProcessor<
  Array<BoardLocation>
> {
  private previous: Array<BoardLocation> = [];

  constructor(private shortestPathCalculator: ShortestPathCalculatorService) {
    super([shortestPathCalculator]);
  }

  protected processData(dataElements: any[]): BoardLocation[] {
    const [path] = dataElements as [Array<BoardLocation> | null];
    if (path === null) {
      return this.previous;
    }
    this.previous = path;
    return path;
  }

  clearData(): void {
    this.subject.next([]);
    this.previous = [];
  }
}
