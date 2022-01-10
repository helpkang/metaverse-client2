
## 호스팅 command
lt --port 3000 --subdomain mvmv


https://mvmv.loca.lt/


## type을 모두 돋일하게
init move health 모두 
player 정보를 올리도록 변경

## 서버 환경 편하게
sqlite는 github private
이미지는 github public에서 주소 접근으로 


## 참조 자료
### 멀티 플레이어 자료
https://blog.cloudflare.com/doom-multiplayer-workers/

# REST/웹소켓/WebRTC 사용구분
## REST
* 지도 정보 저장하고 불러 오는 경우
* 회원가입등 기타 ...
## 웹소켓
* 사용자 움직임 / 메시징

## WebRTC
* 음성 / 화상


# 지금 구현 해야 할것
a. 지도 정보 저장/조회 - rest로 지정하자 --- 버튼 적당히 db
b. 사용자 메타 버스 조인 - 이름으로 관리 -- rest db
c. 사용자 이동/ 메시지 - websocket/inmeory


## 지도정보 저장/조회
size: 32*32 -> 사이즈가 장난 아니지만 다음에
x,y:[0,0,1.....]

## 메타버스 조인
DB에 이름을 기준으로 id를 발급 받고 
id와 이름을 메모리에 담고 시작 좌표를 발급함...
지도 정보도 내려주고 나서 화면 표시
좌표 그룹에 사용자를 담음

## 이동 / 메시지
이동 좌표를 websocket으로 전달 하고
다른 사용자의 이동 좌표를 받음
메시지를 쏘면 인근 사용자에게 전달함

좌표 그룹에 사용자 id로 메시지를 전달

움직임이 없더라도 주기적으로 좌표 신호를 전달
만약 화면이 안열려 있어서 전달이 없으면 로그 아웃시킴

# mysql table creation
## user
id - 자동생성
name - 표시될 이름
create - 처음 생성 시간
update - 마지막 로그인 시간

## 지도 타일
x,y - 0부터 1은포인트가 아니라 타일증가 pixel 증가 / size는 32 타일
      0이면 31 타일 - 총 32개 타일이 존재

array:[]
create - 처음 생성시간
upate - 마지막 수정 시간

## user이동 / 메시지
id로 user 전체 관리
user id,name,좌표, 이동방향, 업데이트 시간

back단에 관리 해주는게 필요 함..



# rest api

user{
    create { // 사용자 로그인
        param: name
        result: id
    } 

}


tile{

    update {
        param:x,y,arr[-2는 변동 없음, -1(없앰), 0부터.. 데이터]
        result:성공여부
    }

    get: {
        param: x,y
        result:x,y,arr
    }
}

# websocket
처음 connection 하면
client send{
    {
        "action":"init"//action
        "payload":"{id, x,y,name,이미지,몇번째이미지}"
    }
    {
        "action":"move"
        "payload":"{x,y,name,이미지,몇번째이미지}"
    }
    {
        "action":"message"
        "payload":"{메시지}"
    }
}
server send{// 나중에 id를 키로 해야 됨
   {
        "action":"init"//action
        "payload":"[{id,x,y,name,이미지,몇번째이미지},...]"
    }
    {
        "action":"move"
        "payload":"{id,x,y,name,이미지,몇번째이미지}"
    }
    {
        "action":"message"
        "payload":"{id,메시지}"
    }
}






