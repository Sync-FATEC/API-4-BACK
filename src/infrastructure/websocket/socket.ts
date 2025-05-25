import { NotificationService } from "./service/NotificationService";
import { WebSocketServer } from "ws";
import { Server } from "http";

let wss: WebSocketServer;
const notificationService = new NotificationService();

export const createSocketServer = (server: Server) => {
  // Inicialize o WebSocketServer com o servidor HTTP
  wss = new WebSocketServer({ server });

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
