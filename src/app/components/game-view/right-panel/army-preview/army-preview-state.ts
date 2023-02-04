import { Army, BoardLocation } from 'src/app/models/game-models';
import {
  FieldSelection,
  GameContext,
} from 'src/app/models/game-utility-models';
import {
  calculateAttackingArmyPower,
  calculateDefendingArmyPower,
  calculateScarabsPower,
} from 'src/app/utils/army-power-calculator';
import {
  getArmyRanges,
  getArrivingBackupAtLocation,
  getOnlyArmyMovementFrozenUnitsAtLocation,
  getScarabsRange,
  ScarabsRange,
  subtractArmies,
  sumArmies,
} from 'src/app/utils/army-utils';
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
  getTotalArmyDescription(
    totalArmy: Army,
    availableUnits: Army
  ): ArmyDescription | null;
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
  scarabs?: string;
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
    const frozenUnits = getOnlyArmyMovementFrozenUnitsAtLocation(
      selectedFieldInfo,
      gameContext.currentActions
    );
    const arrivingBackup = getArrivingBackupAtLocation(
      selectedFieldInfo,
      gameContext.currentActions
    );
    const armyIncludingMovementsFreeze = subtractArmies(army, frozenUnits);
    const armyIncludingMovementsFreezeAndArrivingBackup = sumArmies(
      armyIncludingMovementsFreeze,
      arrivingBackup
    );
    const opponentHasAdvancedTactics =
      gameContext.opponent.upgrades.includes('ADVANCED_TACTICS');
    const playerHasKingOfDesert =
      gameContext.player.upgrades.includes('KING_OF_DESERT');
    const defendingPowerDefault = calculateDefendingArmyPower(
      armyIncludingMovementsFreezeAndArrivingBackup,
      0,
      gameContext.balance,
      gameContext.player,
      gameContext.opponent,
      selectedFieldInfo.field.building
    );
    let defendingPowerString = defendingPowerDefault.toString();
    if (playerHasKingOfDesert || opponentHasAdvancedTactics) {
      const scarabsRange: ScarabsRange = playerHasKingOfDesert
        ? getScarabsRange(
            gameContext.game.stateManager.turnCounter,
            gameContext.balance.combat.scarabs
          )
        : { min: 0, avg: 0, max: 0 };

      const minLevelAttackingArmy: Army = opponentHasAdvancedTactics
        ? { droids: 1, tanks: 1, cannons: 1 }
        : { droids: 0, tanks: 0, cannons: 0 };

      const defendingPowerMin = calculateDefendingArmyPower(
        armyIncludingMovementsFreezeAndArrivingBackup,
        scarabsRange.min,
        gameContext.balance,
        gameContext.player,
        gameContext.opponent,
        selectedFieldInfo.field.building,
        minLevelAttackingArmy
      );
      const defendingPowerMax = calculateDefendingArmyPower(
        armyIncludingMovementsFreezeAndArrivingBackup,
        scarabsRange.max,
        gameContext.balance,
        gameContext.player,
        gameContext.opponent,
        selectedFieldInfo.field.building
      );
      defendingPowerString = `${defendingPowerMin}-${defendingPowerMax}`;
    }

    const attackingPower = calculateAttackingArmyPower(
      armyIncludingMovementsFreeze,
      gameContext.balance,
      gameContext.player
    );
    return {
      defendingPower: defendingPowerString,
      attackingPower: attackingPower.toString(),
    };
  },
  getTotalArmyDescription(
    totalArmy: Army,
    availableUnits: Army
  ): ArmyDescription | null {
    if (!totalArmy || !availableUnits) {
      return null;
    }
    if (
      totalArmy.droids === availableUnits.droids &&
      totalArmy.tanks === availableUnits.tanks &&
      totalArmy.cannons === availableUnits.cannons
    ) {
      return null;
    }
    return {
      droids: totalArmy.droids.toString(),
      tanks: totalArmy.tanks.toString(),
      cannons: totalArmy.cannons.toString(),
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
      droids:
        minArmy.droids !== maxArmy.droids
          ? `${minArmy.droids} - ${maxArmy.droids}`
          : minArmy.droids.toString(),
      tanks:
        minArmy.tanks !== maxArmy.tanks
          ? `${minArmy.tanks} - ${maxArmy.tanks}`
          : minArmy.tanks.toString(),
      cannons:
        minArmy.cannons !== maxArmy.cannons
          ? `${minArmy.cannons} - ${maxArmy.cannons}`
          : minArmy.cannons.toString(),
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
    const minAttackingArmyPower = calculateAttackingArmyPower(
      minArmy,
      gameContext.balance,
      gameContext.opponent
    );
    const maxAttackingArmyPower = calculateAttackingArmyPower(
      maxArmy,
      gameContext.balance,
      gameContext.opponent
    );
    let minScarabs = 0;
    let maxScarabs = 0;
    if (gameContext.opponent.upgrades.includes('KING_OF_DESERT')) {
      const scarabsRange = getScarabsRange(
        gameContext.game.stateManager.turnCounter,
        gameContext.balance.combat.scarabs
      );
      minScarabs = scarabsRange.min;
      maxScarabs = scarabsRange.max;
    }
    const advancedTacticsMinAttackersArmyToConsider: Army =
      gameContext.player.upgrades.includes('ADVANCED_TACTICS')
        ? { droids: 1, tanks: 1, cannons: 1 }
        : { droids: 0, tanks: 0, cannons: 0 };

    const minDefendingArmyPower = calculateDefendingArmyPower(
      minArmy,
      minScarabs,
      gameContext.balance,
      gameContext.opponent,
      gameContext.player,
      selectedFieldInfo.field.building,
      advancedTacticsMinAttackersArmyToConsider,
    );
    const maxDefendingArmyPower = calculateDefendingArmyPower(
      maxArmy,
      maxScarabs,
      gameContext.balance,
      gameContext.opponent,
      gameContext.player,
      selectedFieldInfo.field.building
    );
    return {
      attackingPower: `${minAttackingArmyPower} - ${maxAttackingArmyPower}`,
      defendingPower: `${minDefendingArmyPower} - ${maxDefendingArmyPower}`,
    };
  },
  getTotalArmyDescription(
    totalArmy: Army,
    availableUnits: Army
  ): ArmyDescription {
    return null;
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
    const config = gameContext.balance.combat.scarabs;
    const scarabsRange = getScarabsRange(
      gameContext.game.stateManager.turnCounter,
      config
    );
    const minPower = calculateScarabsPower(
      scarabsRange.min,
      gameContext.balance,
      gameContext.player
    );
    const maxPower = calculateScarabsPower(
      scarabsRange.max,
      gameContext.balance,
      gameContext.player
    );
    return {
      defendingPower: `${minPower}-${maxPower}`,
      attackingPower: '0',
    };
  },
  getTotalArmyDescription(
    totalArmy: Army,
    availableUnits: Army
  ): ArmyDescription {
    return null;
  },
};
