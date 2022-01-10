import * as WebSocket from "ws";
import {
  ResponseNewUserAction,
  SpriteType
} from "../../../shareType/spirteType";


export class MetaverseUser {
  // 업데이트 시간
  udate: number;

  constructor(private user: SpriteType, private ws: WebSocket) {
    this.updateTime();
  }

  updateTime() {
    this.udate = new Date().getTime();
  }

  getId() {
    return this.user.id;
  }

  getName(): string {
    return this.user.name;
  }

  sendClient(mUser: MetaverseUser) {
    if (this.isEquals(mUser)) {
      return;
    }
    const action: ResponseNewUserAction = { type: "new", payload: mUser.user };
    this.ws.send(JSON.stringify(action));
  }
  sendMoveClient(actionStr: string) {


    this.ws.send(actionStr);
  }

  sendClientAllUser(serverUsers: SpriteType[]) {
    this.ws.send(JSON.stringify({ type: "init", payload: serverUsers }));
  }

  sendMessage(id: string, message: string) {
    if (this.getId() === id) {
      return;
    }
    this.ws.send(JSON.stringify({ type: "message", payload: { id, message } }));
  }

  sendRemove(ids: string[]) {
    this.ws.send(JSON.stringify({ type: "remove", payload: ids }));
  }

  isEquals(endUser: MetaverseUser): boolean {
    return this.getId() === endUser.getId();
  }

  getUdate(): number {
    return this.udate;
  }

  getUser() {
    return this.user;
  }

  close() {
    try {
      this.ws.close();
    } catch (e) { }
  }
}
