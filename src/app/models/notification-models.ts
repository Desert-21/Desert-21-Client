export type AppNofication<T> = {
  type: string;
  content: T;
};

export interface NotificationHandler<T> {
  type: string;
  handle: (arg: T) => void;
};

export type NextTurnNotification = {
  currentPlayerId: string;
  timeout: string;
};

export type StartGameNotification = {
  gameId: string;
};
