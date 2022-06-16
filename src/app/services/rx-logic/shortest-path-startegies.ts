import { BoardLocation } from 'src/app/models/game-models';
import {
  DirectedLocationPair,
  GameContext,
} from 'src/app/models/game-utility-models';
import { getFastestUnitsSpeed } from 'src/app/utils/army-utils';
import { Deque } from 'src/app/utils/deque';
import {
  areLocationsEqual,
  findByFieldLocation,
  getLevel1DistancedLocations,
} from 'src/app/utils/location-utils';

export type FindShortestPathStartegy = {
  findShortestPath: (
    locations: DirectedLocationPair,
    context: GameContext
  ) => Array<BoardLocation> | null;
};

export const moveUnitsStrategy: FindShortestPathStartegy = {
  findShortestPath: (
    locations: DirectedLocationPair,
    context: GameContext
  ): Array<BoardLocation> | null => {
    const isTargetValidator: IsFieldDestinationValidator = (location) => {
      return areLocationsEqual(location, locations.to);
    };
    const path = performBFS(locations, context, isTargetValidator);
    if (!validatePathsLength(path, context)) {
      return null;
    }
    return path;
  },
};

export const attackStrategy: FindShortestPathStartegy = {
  findShortestPath: (
    locations: DirectedLocationPair,
    context: GameContext
  ): Array<BoardLocation> | null => {
    const isTargetsNeighbourValidator: IsFieldDestinationValidator = (
      location
    ) => {
      const neighbours = getLevel1DistancedLocations(locations.to);
      return (
        neighbours
          .filter((n) => {
            const field = findByFieldLocation(
              n,
              context.game.fields
            );
            return field.ownerId === context.player.id;
          })
          .find((loc) => areLocationsEqual(location, loc)) !== undefined
      );
    };
    if (isTargetsNeighbourValidator(locations.from)) {
      return [locations.from, locations.to];
    }
    const bfsPart = performBFS(locations, context, isTargetsNeighbourValidator);
    if (bfsPart === null) {
      return null;
    }
    const completePath = [...bfsPart, locations.to];
    if (!validatePathsLength(completePath, context)) {
      return null;
    }
    return [...bfsPart, locations.to];
  },
};

export const validatePathsLength = (path: Array<BoardLocation> | null, context: GameContext): boolean => {
  if (path === null || path.length === 0) {
    return false;
  }
  const firstLoc = path[0];
  const fromField = findByFieldLocation(firstLoc, context.game.fields);
  const fastestUnitSpeed = getFastestUnitsSpeed(
    fromField.army,
    context.balance.combat
  );
  const realLength = path.length - 1;
  return fastestUnitSpeed >= realLength;
};


export const rocketStrikeStrategy: FindShortestPathStartegy = {
  findShortestPath: (
    locations: DirectedLocationPair,
    context: GameContext
  ): Array<BoardLocation> | null => {
    console.log('ROCKET');
    return [];
  },
};

type IsFieldDestinationValidator = (location: BoardLocation) => boolean;

const performBFS = (
  locations: DirectedLocationPair, // pair of always different locations
  context: GameContext,
  validator: IsFieldDestinationValidator
): Array<BoardLocation> | null => {
  const fields = context.game.fields;
  const playerId = context.player.id;
  const pathsDeque = new Deque<Array<BoardLocation>>();
  const checkedLocations = new Set<string>();
  checkedLocations.add(locationToString(locations.from));
  pathsDeque.pushBack([locations.from]);

  while (pathsDeque.length > 0) {
    const currentPath = pathsDeque.popFront();
    const lastLocation = currentPath[currentPath.length - 1];
    const neighbouringLocations = getLevel1DistancedLocations(lastLocation);
    const nonRepeatedLocations = neighbouringLocations.filter(
      (loc) => !checkedLocations.has(locationToString(loc))
    );
    const ownedNonRepeatedLocations = nonRepeatedLocations.filter((loc) => {
      const neighbouringField = findByFieldLocation(loc, fields);
      return neighbouringField.ownerId === playerId;
    });
    for (const location of ownedNonRepeatedLocations) {
      const isCorrect = validator(location);
      const checkedPath = [...currentPath, location];
      if (isCorrect) {
        return checkedPath;
      }
      pathsDeque.pushBack(checkedPath);
      checkedLocations.add(locationToString(location));
    }
  }
  return null;
};

const locationToString = (location: BoardLocation): string => {
  return `${location.row}-${location.col}`;
};
