export interface MWall {

}
export interface MBackGround {

}

export interface MRoom {
    enter(player: Sprite): void;
    leave(player: Sprite): void;
}

export interface TextChat {

}

export interface VideoChat {

}


export interface Sprite {
    move():void
    addChat(chat: TextChat):void
    addVideoChat(chat: VideoChat):void
}

export interface MRemotePlayer extends Sprite {

}

export interface MPlayer extends Sprite {
    makeChat():TextChat
    makeVideoChat():VideoChat
}

export interface MCamera{
    addMMap(map: MMap):void
    addPlayer(player: MPlayer):void
}

export interface MMap {
    init():void
    addBackground(background:MBackGround): void;
    addWall(wall:MWall):void
    addRoom(room:MRoom):void
    addRemotePlayer(remotePlayers:MRemotePlayer):void
    addPlayer(player:MPlayer):void
    addCamera(camera:MCamera):void
}


