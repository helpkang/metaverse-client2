export interface ClientUser {
    userId: string;
    name: string;
    x: number;
    y: number;
    imageType?: number;
    selectImageIdx?: number;
}

export interface ServerUser {
    id: string;
    user:ClientUser
}

export interface ClientMessage {
    message: string;
}

export interface ServerMessage extends ClientMessage {
    id: string;
}

export type DeleteUser = string
