import { GameBalanceConfig } from 'src/app/models/game-config-models';
import { Army, BoardLocation } from 'src/app/models/game-models';
import { GameContext } from 'src/app/models/game-utility-models';
import { getArmyRanges } from 'src/app/utils/army-utils';
import { getFogOfWarLevel } from 'src/app/utils/location-utils';

export type ArmyPreviewState = {
  headerContent: string;
  tooltipContent: string;
  getVisibleImages(
    hasKingOfTheDesert: boolean
  ): [boolean, boolean, boolean, boolean];
  getArmyDescription(
    army: Army,
    gameContext: GameContext,
    location: BoardLocation
  ): ArmyDescription;
};

// represents army as a string, may be converted number or a range
export type ArmyDescription = {
  droids: string;
  tanks: string;
  cannons: string;
};

export const OwnedArmyPreviewState: ArmyPreviewState = {
  headerContent: 'Your Army',
  tooltipContent:
    'Here you can see the details of your army on selected field. You can train more units in your towers and home bases.',
  getVisibleImages(
    hasKingOfTheDesert: boolean
  ): [boolean, boolean, boolean, boolean] {
    return [true, true, true, hasKingOfTheDesert];
  },
  getArmyDescription(
    army: Army,
    gameContext: GameContext,
    location: BoardLocation
  ): ArmyDescription {
    return {
      droids: army.droids.toString(),
      tanks: army.tanks.toString(),
      cannons: army.cannons.toString(),
    };
  },
};

export const EnemyArmyPreviewState: ArmyPreviewState = {
  headerContent: 'Enemy Army',
  tooltipContent:
    'Here you can see the approximated amount of troops on enemy field. The approximation gets less accurate the bigger the distance from one of the fields owned by you.',

  getVisibleImages(
    hasKingOfTheDesert: boolean
  ): [boolean, boolean, boolean, boolean] {
    return [true, true, true, hasKingOfTheDesert];
  },

  getArmyDescription(
    army: Army,
    gameContext: GameContext,
    location: BoardLocation
  ): ArmyDescription {
    const fogOfWarLevel = getFogOfWarLevel(
      location,
      gameContext.game.fields,
      gameContext.player.id
    );
    const { minArmy, maxArmy, isUnknown } = getArmyRanges(
      fogOfWarLevel,
      gameContext.balance,
      army
    );
    if (isUnknown) {
      return {
        droids: '?',
        tanks: '?',
        cannons: '?',
      };
    }
    return {
      droids: `${minArmy.droids} - ${maxArmy.droids}`,
      tanks: `${minArmy.tanks} - ${maxArmy.tanks}`,
      cannons: `${minArmy.cannons} - ${maxArmy.cannons}`,
    };
  },
};

export const DesertArmyPreviewState: ArmyPreviewState = {
  headerContent: 'Unoccupied Field Defenders',
  tooltipContent:
    'Here you can see the approximated amount of scarabs defending unoccupied field.',
  getVisibleImages(
    hasKingOfTheDesert: boolean
  ): [boolean, boolean, boolean, boolean] {
    return [false, false, false, true];
  },
  getArmyDescription(
    army: Army,
    gameContext: GameContext,
    location: BoardLocation
  ): ArmyDescription {
    return {
      droids: '0',
      tanks: '0',
      cannons: '0',
    };
  },
};
