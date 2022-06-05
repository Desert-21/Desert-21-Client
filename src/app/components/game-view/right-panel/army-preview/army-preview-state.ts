import { GameBalanceConfig } from 'src/app/models/game-config-models';
import {
  Army,
  BoardLocation,
  Building,
  Player,
} from 'src/app/models/game-models';
import {
  FieldSelection,
  GameContext,
} from 'src/app/models/game-utility-models';
import { calculateArmyPower } from 'src/app/utils/army-power-calculator';
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
  getArmyPowerDescription(
    army: Army, // base army
    gameContext: GameContext,
    selectedFieldInfo: FieldSelection
  ): ArmyPowerDescription;
};

export type ArmyPowerDescription = {
  defendingPower: string;
  attackingPower: string;
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
  getArmyPowerDescription(
    army: Army,
    gameContext: GameContext,
    selectedFieldInfo: FieldSelection
  ): ArmyPowerDescription {
    const defendingPower = calculateArmyPower(
      army,
      gameContext.balance,
      gameContext.player,
      selectedFieldInfo.field.building,
      true
    );
    const attackingPower = calculateArmyPower(
      army,
      gameContext.balance,
      gameContext.player,
      selectedFieldInfo.field.building,
      false
    );
    return {
      defendingPower: defendingPower.toString(),
      attackingPower: attackingPower.toString(),
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
  getArmyPowerDescription(
    army: Army,
    gameContext: GameContext,
    selectedFieldInfo: FieldSelection
  ): ArmyPowerDescription {
    const { row, col } = selectedFieldInfo;
    const fogOfWar = getFogOfWarLevel(
      { row, col },
      gameContext.game.fields,
      gameContext.opponent.id
    );
    console.log(fogOfWar, army, gameContext);
    const { minArmy, maxArmy, isUnknown } = getArmyRanges(
      fogOfWar,
      gameContext.balance,
      army
    );
    if (isUnknown) {
      return {
        defendingPower: '???',
        attackingPower: '???',
      };
    }
    const minAttackingArmyPower = calculateArmyPower(
      minArmy,
      gameContext.balance,
      gameContext.opponent,
      selectedFieldInfo.field.building,
      false
    );
    const maxAttackingArmyPower = calculateArmyPower(
      maxArmy,
      gameContext.balance,
      gameContext.opponent,
      selectedFieldInfo.field.building,
      false
    );
    const minDefendingArmyPower = calculateArmyPower(
      minArmy,
      gameContext.balance,
      gameContext.opponent,
      selectedFieldInfo.field.building,
      true
    );
    const maxDefendingArmyPower = calculateArmyPower(
      maxArmy,
      gameContext.balance,
      gameContext.opponent,
      selectedFieldInfo.field.building,
      true
    );
    return {
      attackingPower: `${minAttackingArmyPower} - ${maxAttackingArmyPower}`,
      defendingPower: `${minDefendingArmyPower} - ${maxDefendingArmyPower}`,
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
  getArmyPowerDescription(
    army: Army,
    gameContext: GameContext,
    selectedFieldInfo: FieldSelection
  ): ArmyPowerDescription {
    return {
      defendingPower: '100-140',
      attackingPower: '0',
    };
  },
};
