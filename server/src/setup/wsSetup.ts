import { Server } from "http";
import * as WebSocket from "ws";

import { webserviceListen } from "../route/ws/webserviceListen";


export const wsSetup = (server: Server) => {
  //initialize the WebSocket server instance
  const wss = new WebSocket.Server({ server, path: "/user" });
  webserviceListen(wss);
};

