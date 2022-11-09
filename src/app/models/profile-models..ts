export type UsersData = {
  id: string;
  nickname: string;
  friends: Array<FriendEntry>;
};

export type FriendEntry = {
  playerId: string;
  nickname: string;
};
