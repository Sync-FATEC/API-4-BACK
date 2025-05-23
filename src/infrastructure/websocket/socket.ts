import { NotificationService } from "./service/NotificationService";
import { WebSocketServer } from "ws";

let wss: WebSocketServer;
const notificationService = new NotificationService();

export const createSocketServer = (server) => {
  // Inicialize o WebSocketServer com o servidor HTTP
  wss = new WebSocketServer({ port: 5555 });

  wss.on("connection", (ws) => {
    console.log("🔥 Cliente conectado");

    ws.on("close", () => {
      console.log("❌ Cliente desconectado");
    });

    ws.on("message", (msg) => {
      console.log("📩 Mensagem recebida:", msg.toString());
    });
  });

  notificationService.setServer(wss);
};

// Export the notification service instance
export const getNotificationService = () => notificationService;
