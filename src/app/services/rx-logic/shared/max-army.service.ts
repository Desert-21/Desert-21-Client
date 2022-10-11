import { Injectable } from '@angular/core';
import { Army } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import { flattenFields } from 'src/app/utils/location-utils';
import { ResourceProcessor } from '../templates/resource-processor';
import { GameContextService } from './game-context.service';

@Injectable({
  providedIn: 'root',
})
export class MaxArmyService extends ResourceProcessor<Army> {
  constructor(private contextService: GameContextService) {
    super([contextService]);
  }

  protected processData(dataElements: any[]): Army {
    const [context] = dataElements as [GameContext];
    const allFields = flattenFields(context.game.fields);
    const occupiedFields = allFields.filter((field) => field.ownerId !== null);
    const occupiedFieldsWithArmy = occupiedFields.filter(
      (field) => field.army !== null
    );
    return occupiedFieldsWithArmy
      .map((f) => f.army)
      .reduce(this.maxOf, { droids: 0, tanks: 0, cannons: 0 });
  }

  private maxOf(army1: Army, army2: Army): Army {
    return {
      droids: Math.max(army1.droids, army2.droids),
      tanks: Math.max(army1.tanks, army2.tanks),
      cannons: Math.max(army1.cannons, army2.cannons),
    };
  }
}
