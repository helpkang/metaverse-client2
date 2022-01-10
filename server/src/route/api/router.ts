import * as express from 'express';
import { userRoute } from "./user/user"

export const routeSetup=(app:express.Application)=>{
    app.use('/api/user',userRoute)
}