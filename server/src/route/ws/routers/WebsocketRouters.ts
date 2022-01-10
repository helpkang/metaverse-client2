import { WebSocket } from "ws";
import { WebsocketAction } from "../../../shareType/spirteType";
import { Metaverse } from "../meta/Metaverse";
import { MetaverseUser } from "../meta/MetaverseUser";

interface RouterMap {
    [key: string]: IWebsocketWorker 
}

export class WebsocketRouters {
 
    routerMap: RouterMap= {};

    constructor(private metaverse: Metaverse) { }

    dispath(id:string, action: WebsocketAction<any>, ws: WebSocket) : void | Promise<any>{
        const router = this.routerMap[action.type];
        if (router) {
            return router.doAction(this.metaverse, id, action, ws);
        }
    }
    
    addRouter(type: string, router: IWebsocketWorker) {
        this.routerMap[type] = router;
    }

    addRouters(routerMap: RouterMap) {
        this.routerMap= {...this.routerMap, ... routerMap};
    }
}



export interface IWebsocketWorker {
    doAction(metaverse: Metaverse, id:string, action: WebsocketAction<any>, ws:WebSocket): void | Promise<any>;
}
