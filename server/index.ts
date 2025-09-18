/**
 * Schiffe Versenken – Mini-Chat / Server
 * 
 * - Der Server läuft mit HTTP + Socket.IO, empfängt Chat-Nachrichten von Clients und bestätigt jede Nachricht zurück an den Absender 
 */

import http from "http";
import { Server } from "socket.io"; 

// Erstellt HTTP-Server
const server = http.createServer();

// Socket.IO Server mit CORS für die lokales Zusammenarbeit von Front- und Backend
const io = new Server(server, {
  cors: { origin: "*" },
});

// Für Client-Verbindung
io.on("connection", (socket) => {
  console.log("Neuer Client verbunden:", socket.id);

  /**
   * Chat: Client → Server
   * Eventname: "lobby.chat.senden"
   */
  socket.on("lobby.chat.senden", (eingabe: { text?: string }) => {
    // Eingabetext aus Eingabe lesen, Leerzeichen entfernen
    const nachricht = String(eingabe?.text ?? "").trim();

    // Validierung
    if (!nachricht) {
      socket.emit("error", {
        code: "CHAT_LEER",
        message: "Nachricht darf nicht leer sein.",
      });
      return;
    }

    // Log ins Terminal
    console.log(`[CHAT] ${socket.id}: ${nachricht}`);

    // Bestätigung an Absender
    socket.emit("lobby.chat.ok", { received: true, text: nachricht });
    // Broadcasting an alle Clients + Sender
    io.emit("lobby.chat.empfangen", { von: socket.id, text: nachricht });
  });
});

server.listen(3000, () => {
  console.log("Server läuft auf http://localhost:3000");
});
