import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { AppNofication, NotificationHandler } from '../models/notification-models';

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

  _connect() {
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect(
      {},
      function (frame) {
        _this.stompClient.subscribe(
          _this.topic,
          function (sdkEvent) {
            _this.onMessageReceived(sdkEvent);
          },
          {
            Authorization: _this.token,
          }
        );
        //_this.stompClient.reconnect_delay = 2000;
      },
      this.errorCallBack
    );
  }

  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error) {
    setTimeout(() => {
      this._connect();
    }, 5000);
  }

  /**
   * Send message to sever via web socket
   * @param {*} message
   */
  _send(message) {
    this.stompClient.send('/app/hello', {}, JSON.stringify(message));
  }

  onMessageReceived(message: any) {
    let body = message.body as AppNofication<any>;
    this.messageHandlers.filter(handler => handler.type === body.type)
    .forEach(handler => {
      handler.handle(body);
    });
  }
}
