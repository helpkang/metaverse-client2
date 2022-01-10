import{ WebSocketServer, WebSocket } from "ws";
import { v4 } from 'uuid';

import { Metaverse } from "./meta/Metaverse";
import { MetaverseUser } from "./meta/MetaverseUser";
import { routers } from "./routers/RouterSetup";
import { WebsocketAction } from "../../shareType/spirteType";


export function webserviceListen(wss: WebSocketServer) {

  const metaverse = new Metaverse()
  metaverse.clearUnHealtyUsersByInterval({interTime:1000 * 12, lifeTime:1000 *5});
  
  wss.on("connection", (ws: WebSocket) => {  
    
    const uRouter = routers(metaverse);

    const id: string = v4();
    
    ws.on("message", (data: string) => {

      const wsAction = JSON.parse(data) as WebsocketAction<any>;

      uRouter.dispath(id, wsAction, ws);

    });
    const close = () => {
      metaverse.remove(id);
    }
    ws.on('close', close);
    ws.on('error', close);
  });

}


