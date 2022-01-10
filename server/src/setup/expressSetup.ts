import * as express from 'express';
import * as http from 'http';
import { wsSetup } from './wsSetup';
import { routeSetup } from '../route/api/router';

export const app:express.Application = express();
app.use(express.json());
app.use(express.static('../client/build'));
routeSetup(app)


//initialize a simple http server
const server = http.createServer(app);

wsSetup(server)


//start our server
const port = process.env.PORT || 3200
server.listen(port, () => {
    console.log(`Server started on port http://localhost:${port} :)`);
});