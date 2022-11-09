import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationHandler } from 'src/app/models/notification-models';

@Injectable({
  providedIn: 'root',
})
export class PingRequestedHandlerService
  implements NotificationHandler<string>
{
  constructor(private http: HttpClient) {}

  type = 'PING_REQUESTED';

  handle(playersId: string): void {
    this.http.post(`/users/ping/active/${playersId}`, null).subscribe(() => {});
  }
}
