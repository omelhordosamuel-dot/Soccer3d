const http = require("http");
const { WebSocket, WebSocketServer } = require("ws");

const PORT = Number(process.env.PORT || 8080);
const rooms = new Map();

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true, rooms: rooms.size }));
});

const wss = new WebSocketServer({ server });

function makeRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return rooms.has(code) ? makeRoomCode() : code;
}

function send(socket, data) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
}

function getPeer(socket) {
  const room = rooms.get(socket.roomCode);
  if (!room) return null;
  return socket.role === "host" ? room.guest : room.host;
}

function leaveRoom(socket) {
  if (!socket.roomCode) return;

  const room = rooms.get(socket.roomCode);
  if (!room) {
    socket.roomCode = "";
    socket.role = "";
    return;
  }

  const peer = getPeer(socket);
  if (peer) {
    send(peer, { type: "peerLeft" });
  }

  rooms.delete(socket.roomCode);
  socket.roomCode = "";
  socket.role = "";
}

wss.on("connection", (socket) => {
  socket.roomCode = "";
  socket.role = "";

  socket.on("message", (buffer) => {
    let data;
    try {
      data = JSON.parse(buffer.toString());
    } catch {
      send(socket, { type: "error", message: "Mensagem invalida." });
      return;
    }

    if (data.type === "createRoom") {
      leaveRoom(socket);
      const roomCode = makeRoomCode();
      rooms.set(roomCode, { host: socket, guest: null });
      socket.roomCode = roomCode;
      socket.role = "host";
      send(socket, { type: "roomCreated", roomCode });
      send(socket, { type: "roomJoined", roomCode, role: "host" });
      return;
    }

    if (data.type === "joinRoom") {
      const roomCode = String(data.roomCode || "").trim().toUpperCase();
      const room = rooms.get(roomCode);
      if (!room || room.guest) {
        send(socket, { type: "error", message: "Sala inexistente ou cheia." });
        return;
      }

      leaveRoom(socket);
      room.guest = socket;
      socket.roomCode = roomCode;
      socket.role = "guest";
      send(socket, { type: "roomJoined", roomCode, role: "guest" });
      send(room.host, { type: "peerJoined" });
      return;
    }

    if (data.type === "relay") {
      const peer = getPeer(socket);
      if (!peer) return;
      send(peer, { type: "relay", message: data.message });
      return;
    }

    if (data.type === "leaveRoom") {
      leaveRoom(socket);
    }
  });

  socket.on("close", () => leaveRoom(socket));
});

server.listen(PORT, () => {
  console.log(`Multiplayer server listening on :${PORT}`);
});
