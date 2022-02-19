export type AppNofication<T> = {
  type: string;
  content: T;
};

export type NotificationHandler<T> = {
  type: string;
  handle: (arg: T) => void;
};
