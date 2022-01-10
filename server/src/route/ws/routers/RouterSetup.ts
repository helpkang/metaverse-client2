import { WebSocket } from "ws";

import {
  HealthUserAction,
  RequestSetUserAction,
  RequestInitAction,
  RequestTalkrAction,
  SpriteType,
  WebsocketAction,
} from "../../../shareType/spirteType";
import { Metaverse } from "../meta/Metaverse";
import { MetaverseUser } from "../meta/MetaverseUser";
import { IWebsocketWorker, WebsocketRouters } from "./WebsocketRouters";

export const routers = (metaverse: Metaverse): WebsocketRouters => {
  const websocketRouters = new WebsocketRouters(metaverse);
  websocketRouters.addRouters({
    init: new InitWebsocketWorker(),
    setUser: new GetUserWebsocketWorker(),
    move: new MoveWebsocketWorker(),
    health: new HealthWebsocketWorker(),
    talk: new TalkWebsocketWorker(),
  });
  return websocketRouters;
};

class InitWebsocketWorker implements IWebsocketWorker {
  doAction(
    metaverse: Metaverse,
    id: string,
    action: RequestInitAction,
    ws: WebSocket
  ): void | Promise<any> {
    // console.log("InitWebsocketWorker.doAction", action);
    const user = action.payload;

    user.id = id;

    const newUser = new MetaverseUser(user, ws);
    metaverse.sendNewUserToAll(newUser);
    metaverse.sendToAllToUser(newUser);
    metaverse.add(newUser);
  }
}
class GetUserWebsocketWorker implements IWebsocketWorker {
  doAction(
    metaverse: Metaverse,
    id: string,
    action: RequestSetUserAction,
    ws: WebSocket
  ): void | Promise<any> {
    // console.log("GetUserWebsocketWorker.doAction", action);
    const { from, to } = action.payload;
    metaverse.sendFromTo(id, to.id)
    // metaverse.sendFromTo(reqId, id)
    // metaverse.sendFromTo(id, reqId)

  }
}

//TODO: update users에 하도록 변경
class MoveWebsocketWorker implements IWebsocketWorker {
  doAction(
    metaverse: Metaverse,
    id: string,
    action: WebsocketAction<SpriteType>,
    ws: WebSocket
  ): void | Promise<any> {
    // console.log("MoveWebsocketWorker.doAction", action);
    const clientUser = action.payload as SpriteType;

    clientUser.id = id;

    const updateUser = new MetaverseUser(clientUser, ws);
    metaverse.update(updateUser);
    metaverse.sendMoveToAll(updateUser);
  }
}
class HealthWebsocketWorker implements IWebsocketWorker {
  doAction(
    metaverse: Metaverse,
    id: string,
    action: WebsocketAction<SpriteType>,
    ws: WebSocket
  ): void | Promise<any> {
    // console.log("HealthWebsocketWorker.doAction", action);
    // const user = action.payload
    // metaverse.updateTime(id);
    // metaverse.sendMoveToAll(user);
    const clientUser = action.payload as SpriteType;

    clientUser.id = id;

    const updateUser = new MetaverseUser(clientUser, ws);
    metaverse.update(updateUser);
    metaverse.sendMoveToAll(updateUser);

  }
}

class TalkWebsocketWorker implements IWebsocketWorker {
  doAction(
    metaverse: Metaverse,
    id: string,
    action: RequestTalkrAction,
    ws: WebSocket
  ): void | Promise<any> {
    // console.log("TalkWebsocketWorker.doAction", action);
    const { message } = action.payload

    metaverse.sendMessage(id, message);
  }
}
