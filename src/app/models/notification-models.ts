export type AppNofication<T> = {
  type: string;
  content: T;
};

export interface NotificationHandler<T> {
  type: string;
  handle: (arg: T) => void;
};

export type StartGameNotification = {
  currentPlayerId: string;
  timeout: string;
};
