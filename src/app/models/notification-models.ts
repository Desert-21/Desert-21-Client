export type AppNotification<T> = {
  type: string;
  content: T;
};

export interface NotificationHandler<T> {
  type: string;
  handle: (arg: T) => void;
}

export type NextTurnNotification = {
  currentPlayerId: string;
  timeout: string;
};

export type StartGameNotification = {
  gameId: string;
};

export type ResolutionPhaseNotification = {
  timeout: Date, notifications: Array<AppNotification<any>>
};
