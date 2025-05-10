import { INotificationService } from "../../../domain/interfaces/INotificationService";
import WebSocket, { WebSocketServer } from "ws";
import { log } from "console";

export class NotificationService implements INotificationService {
  private server: WebSocketServer;

  setServer(server: WebSocketServer): void {
    this.server = server;
  }

  sendNotification(message: string, data?: any): void {
    let messageToSend = JSON.stringify({
      type: "notification",
      message: message,
      data: data,
    });

    this.server.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        log("Sending message to client:",  messageToSend);
        client.send(messageToSend);
      }
    });
  }
  
  sendBroadcastNotification(notification: any): void {
    if (this.server) {
      this.server.emit("receiveAlert", notification);
    }
  }
}
