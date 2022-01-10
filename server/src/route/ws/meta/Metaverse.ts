import { isInt16Array } from "util/types";
import { MetaverseUser } from "./MetaverseUser";



export class Metaverse {

  mUsers = {} as { [key: string]: MetaverseUser };
  
  constructor() {}

  updateTime(id: string) {
    const findUser = this.find(id);
    if (findUser) findUser.udate = new Date().getTime();
  }



  sendNewUserToAll(newUser: MetaverseUser) {
    Object.values(this.mUsers).forEach((user) => {
      if (!newUser.isEquals(user)) {
        user.sendClient(newUser);
      }
    });
  }

  sendMoveToAll(newUser: MetaverseUser) {
    const user = newUser.getUser();
    // const { id, direction, directionIndex, gPoint } = user;
    const actionStr = JSON.stringify({
      type: "move",
      payload: user,
    });
    Object.values(this.mUsers)
    .filter((user)=>isIn(newUser, user))
    .forEach((user) => {
      if (!newUser.isEquals(user)) {
        user.sendMoveClient(actionStr);
      }
    });
  }

  sendToAllToUser(mUser: MetaverseUser) {
    // user.sendClient(updateUser)
    const users = Object.values(this.mUsers)
    .filter((user)=>isIn(mUser, user))
    .map((mUser) => {
      return mUser.getUser();
    });
    mUser.sendClientAllUser(users);
  }

  sendFromTo(reqId: string, id: string) {
    const from = this.find(reqId);
    const to = this.find(id);
    if(from && to ) to.sendClient(from);
  }

  sendMessage(id: string, message: string) {
    const from = this.find(id)
    Object.values(this.mUsers)
    .filter((user)=>isIn(from, user))
    .forEach((user) => {
      if (id !== user.getId()) {
        user.sendMessage(id, message);
      }
    });
  }

  add(user: MetaverseUser) {
    this.mUsers[user.getId()] = user;
  }

  private find(id: string): MetaverseUser {
    return this.mUsers[id];
  }

  update(user: MetaverseUser) {
    this.mUsers[user.getId()] = user;
  }

  remove(id: string) {
    this.removeIds([id]);
  }

  removeIds(ids: string[]) {
    ids.forEach((id) => {
      delete this.mUsers[id];
    });
    Object.values(this.mUsers).forEach((user) => {
      user.sendRemove(ids);
    });
  }

  /**
   *
   * @param interTime interval time in ms
   * @param lifeTime palyer 위치정보 전송하고 해당 시간만큼 유지 시키고 정보가 업데이트 안되면 지움
   */
  clearUnHealtyUsersByInterval({
    interTime,
    lifeTime,
  }: {
    interTime: number;
    lifeTime: number;
  }) {
    setInterval(() => {
      this.intervalCall(lifeTime);
    }, interTime);
  }

  private intervalCall(keppTime: number) {
    const checkDate = new Date().getTime() - keppTime;
    const deleteIds: string[] = [];
    Object.entries(this.mUsers).forEach(([id, user]) => {
      const alive = user.udate > checkDate;
      if (!alive) {
        try {
          this.mUsers[id].close();
        } catch (e) {}
        deleteIds.push(id);
        delete this.mUsers[id];
      }
    });
    if (deleteIds.length > 0) {
      this.removeIds(deleteIds);
    }
  }
}


function isIn(newUser: MetaverseUser, user: MetaverseUser): boolean {
  const { gPoint } = newUser.getUser();
  const { gPoint: userGPoint } = user.getUser();

  const { x: newX, y: newY } = gPoint;
  const { x: userX, y: userY } = userGPoint;

  const xdistance = Math.abs(newX - userX) 
  const ydistance = Math.abs(newY - userY);
  if(xdistance<1500 && ydistance<1500) return true;
  return false;
}

