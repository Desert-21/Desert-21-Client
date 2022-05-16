import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.notificationsService.requireServerNotifications();
  }

  logOut(): void {
    this.tokenService.saveToken('');
    this.router.navigate(['login']);
  }
}
