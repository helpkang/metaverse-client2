import { MetaverseUser } from "../route/ws/meta/MetaverseUser";


//init request
export type RequestInitAction = WebsocketAction<SpriteType>;
export type RequestSetUserAction = WebsocketAction<any>;
export type HealthUserAction = WebsocketAction<MetaverseUser>;
export type RequestTalkrAction = WebsocketAction<{message:string}>;


// RESPONE
//init 
export type ResponseInitAction = WebsocketAction<SpriteType[]>;
export type ResponseNewUserAction = WebsocketAction<SpriteType>;
//move 
export type ResonseMoveAction = WebsocketAction<SpriteType>;



/**
 * 서버에서 주고 받는 데이터
 */
 export interface WebsocketAction<T> {
    type: string;
    payload: T;
}


/**
 * sprite 정보를 서버에 주고 
 * 서버에서 받은 정보로 리모트 사용자를 그림
 */
export interface SpriteType {
    id?: string;//서버에서 내려옴
    name: string;
    src: string;
    spriteSize: number;
    direction: AnimationType 
    directionIndex: number,
    spriteArrays: { [key: string]: number[]; };
    scale?: { [key: string]: Point; }
    gPoint: Point;
 
}



















export interface Point {
    x: number;
    y: number;
  }



export enum AnimationType {
    LEFT = "left",
    RIGHT= "right",
    UP="up",
    DOWN ="down",
  }