import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); 

export default function App() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    socket.on("lobby.chat.ok", (d: { received: boolean; text: string }) => {
      setStatus(`Server hat deine Nachricht erhalten: "${d.text}"`);
    });
    socket.on("error", (e: any) => setStatus(`${e.code}: ${e.message}`));
    return () => {
      socket.off("lobby.chat.ok");
      socket.off("error");
    };
  }, []);

 // Chat-Nachricht speichern und an den Server schicken
const senden = () => {
  const nachricht = text.trim();
  if (!nachricht) return;
  socket.emit("lobby.chat.senden", { text: nachricht });
  setStatus("Sende…");
  setText("");
};


  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <h1>Schiffe versenken – Chat (Client → Server)</h1>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nachricht eingeben…"
        onKeyDown={(e) => e.key === "Enter" && senden()}
        style={{ width: 320 }}
      />
      <button onClick={senden} style={{ marginLeft: 8 }}>Senden</button>
      <p style={{ marginTop: 8 }}>{status}</p>
    </div>
  );
}
