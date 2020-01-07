import path from "path";
import { createServer } from "http";
import express from "express";
import socketIO from "socket.io";
import { emittableEvents, kernel } from "./game";

const app = express();
const http = createServer(app);
const io = socketIO(http);
const port = process.env.PORT || 4000;
const gameKernel = Object.create(kernel);

app.get("/", function(req, res) {
  res.sendFile(path.resolve("./src/server/index.html"));
});

io.on("connection", function(socket) {
  console.log("a user connected");

  socket.on("chat message", function(message) {
    console.log(`message: ${message}`);
    io.emit("chat message", message);
  });

  socket.on(emittableEvents.PLAYER_REQUEST_HIT, function(data) {
    const { playerId, handId } = data;
    const card = kernel.drawCard();
    io.emit(emittableEvents.PLAYER_RECEIVED_HIT, card);
  });

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});

http.listen(port, function() {
  console.log("listening on *:3000");
});
