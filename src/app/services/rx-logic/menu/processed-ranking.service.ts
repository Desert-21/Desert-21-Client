import { Injectable } from '@angular/core';
import { UsersData } from 'src/app/models/profile-models.';
import { RankingEntry, RankingService } from '../../http/ranking.service';
import { UserInfoService } from '../../http/user-info.service';
import { ResourceProcessor } from '../templates/resource-processor';

export type ProcessedRankingEntry = RankingEntry & {
  isFriends: boolean;
  isPlayer: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class ProcessedRankingService extends ResourceProcessor<
  Array<ProcessedRankingEntry>
> {
  constructor(
    private userInfoService: UserInfoService,
    private rankingService: RankingService
  ) {
    super([userInfoService, rankingService]);
  }

  protected processData(dataElements: any[]): ProcessedRankingEntry[] {
    const [userInfo, rankingEntries] = dataElements as [
      UsersData,
      Array<RankingEntry>
    ];
    return rankingEntries.map((entry) => ({
      ...entry,
      isPlayer: entry.id === userInfo.id,
      isFriends:
        userInfo.friends.find((f) => f.playerId === entry.id) !== undefined,
    }));
  }
}
