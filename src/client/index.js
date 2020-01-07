// external
import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch } from "react-router-dom";
import io from "socket.io-client";

// internal
import { createRouter } from "./router/createRouter.js";
import "./assets/stylesheets/index.css";

const socket = io("http://localhost:4000");
socket.emit("chat message", "this is ws message");
socket.on("chat message", function(msg) {
  console.log(`received message from socket server: ${msg}`);
});
socket.emit("PLAYER_REQUEST_HIT", {
  playerId: "bc1cd8e4-fb2a-4e34-9d28-bfa58d501f61",
  handId: "99cc6959-e4cd-4d6f-8c55-2550613ce98c"
});
socket.on("PLAYER_RECEIVED_HIT", function(msg) {
  console.log("player received hit: ", msg);
});

async function init() {
  const router = createRouter(() => (
    <Switch>
      <Route
        exact
        path="/"
        component={() => (
          <div>
            <span className="f2 firaSans">hello world</span>
          </div>
        )}
      />
    </Switch>
  ));

  ReactDOM.render(router, document.getElementById("app"));
}

init();
