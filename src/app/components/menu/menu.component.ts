import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentGameResponse } from 'src/app/models/game-utility-models';
import { BearerTokenService } from 'src/app/services/bearer-token.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  constructor(
    private tokenService: BearerTokenService,
    private router: Router,
    private notificationsService: NotificationsService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.notificationsService.requireServerNotifications();
    this.fetchForCurrentGames();
  }

  logOut(): void {
    this.tokenService.saveToken('');
    this.router.navigate(['login']);
  }

  fetchForCurrentGames(): void {
    this.http.get<CurrentGameResponse>('/games').subscribe({
      next: (resp) => {
        const gameId = resp.gameId;
        if (gameId !== null) {
          this.router.navigate(['game', gameId]);
        }
      }
    });
  }
}
