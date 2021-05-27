import express from 'express';

import actionsController from './controllers/actionsController';
import sipCallController from './controllers/sipCallController';

const routes = express.Router();

routes.get('/extensionStatus', actionsController.actionExtenStatus);
routes.get('/sipPeers', actionsController.actionSipPeers);
routes.get('/sipHints', actionsController.actionHints);


routes.get('/sipCall', sipCallController.call);
routes.get('/sipFunctions', sipCallController.callFunctions);

routes.get('/call/:typeCall/', sipCallController.callStatus);
routes.get('/:statusPhone', sipCallController.infPhone);


export default routes;

// http://10.1.31.92:3334/registered
// http://10.1.31.92:3334/notRegistered
// http://10.1.31.92:3334/call/incomingCall?data=$remote
// http://10.1.31.92:3334/call/inCall?data=0
// http://10.1.31.92:3334/call/endCall?data=$duration