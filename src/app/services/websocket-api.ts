import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { AppNotification, NotificationHandler } from '../models/notification-models';

export class WebSocketAPI {
  messageHandlers: Array<NotificationHandler<any>> = [];
  userId: string;
  token: string;
  topic: string;
  webSocketEndPoint: string;
  stompClient: any;

  constructor(userId: string, token: string, messageHandlers: Array<NotificationHandler<any>>) {
    this.userId = userId;
    this.token = token;
    this.webSocketEndPoint = `${environment.serverApiUrl}/ws`;
    this.topic = `/topics/users/${this.userId}`;
    this.messageHandlers = messageHandlers;
  }

  _connect(): void {
    const ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    this.stompClient.debug = () => {};
    const that = this;
    that.stompClient.connect(
      {},
      frame => {
        that.stompClient.subscribe(
          that.topic,
          sdkEvent => {
            that.onMessageReceived(sdkEvent);
          },
          {
            Authorization: that.token,
          }
        );
        // _this.stompClient.reconnect_delay = 2000;
      },
      this.errorCallBack
    );
  }

  _disconnect(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error): void {
    setTimeout(() => {
      this._connect();
    }, 5000);
  }

  _send(message): void {
    this.stompClient.send('/app/hello', {}, JSON.stringify(message));
  }

  onMessageReceived(message: any): void {
    const body = JSON.parse(message.body) as AppNotification<any>;
    console.log(body);
    this.messageHandlers.filter(handler => handler.type === body.type)
    .forEach(handler => {
      handler.handle(body.content);
    });
  }
}
