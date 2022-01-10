import * as express from 'express';
import { ClientUser } from '../../../ClientServerUser';

// import { sqlitePromise } from '../../../setup/sqliteSetup';


const innerRouter = express.Router()

innerRouter.use(async(req, res, next)=>next())

// get은 샘플임
innerRouter.get('/', async (_, res)=>{
//    const result = await sqlitePromise.fetchFirsRow('SELECT name, cdate FROM user order by cdate desc')
    res.send('hello')
})
// 실제 사용자 등록이 되면 됨
innerRouter.post('/', async (req, res)=>{
    req.headers['contet-type']='application/json'
    
    const {name, userId} = req.body
    const point = {x:Math.floor(Math.random()*500), y:Math.floor(Math.random()*500)}

    const upont:ClientUser  ={
        name,
        userId,
        ...point
    }

    // const findUser = udata.users.find(user=>user.name === name)
    // if(findUser){
    //     findUser.x = upont.x
    //     findUser.y = upont.y
    // }else {
    //     udata.users.push(upont)
    // }


    // const cdate = new Date().toISOString()
    // const result = await sqlitePromise.insert(`INSERT INTO user (name, cdate) VALUES (?, ? )`, name, cdate)

    //TODO: register user to websocket user list
    res.send(point)
})

export const userRoute = innerRouter