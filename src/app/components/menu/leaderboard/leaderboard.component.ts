import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ErrorService } from 'src/app/services/error.service';
import { RankingService } from 'src/app/services/http/ranking.service';
import { PlayerInvitedService } from 'src/app/services/rx-logic/menu/player-invited.service';
import {
  ProcessedRankingEntry,
  ProcessedRankingService,
} from 'src/app/services/rx-logic/menu/processed-ranking.service';
import { GameModalService } from 'src/app/services/rx-logic/shared/game-modal.service';
import { ToastsService } from 'src/app/services/rx-logic/shared/toasts.service';
import { InvitationIdJson } from '../friends/friends-list/friends-list.component';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  isLoading = false;
  ranking: Array<ProcessedRankingEntry> = [];

  constructor(
    private rankingService: ProcessedRankingService,
    private unprocessedRankingService: RankingService,
    private http: HttpClient,
    private toastsService: ToastsService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.rankingService.getStateUpdates().subscribe((ranking) => {
      this.ranking = ranking;
    });
    this.unprocessedRankingService.fetchState();
    this.rankingService.requestState();
  }

  getTooltipValue(entry: ProcessedRankingEntry): string {
    if (entry.isPlayer) {
      return 'You cannot add yourself as a friend!';
    }
    if (entry.isFriends) {
      return 'You are already friends!';
    }
    return '';
  }

  onInvitePlayerClick(player: ProcessedRankingEntry): void {
    this.isLoading = true;

    this.http.post(`/friends/request/${player.nickname}`, null).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastsService.add({
          theme: 'PRIMARY',
          title: 'Invite has been send!',
          description: 'You must now wait until player accepts your request.',
        });
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorService.showError(err.error);
      },
    });
  }
}
