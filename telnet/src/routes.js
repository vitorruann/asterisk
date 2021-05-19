import express from 'express';

import actionsController from './controllers/actionsController';
import sipCallController from './controllers/sipCallController';

const routes = express.Router();

routes.get('/extensionStatus', actionsController.actionExtenStatus);
routes.get('/sipPeers', actionsController.actionSipPeers);
routes.get('/sipHints', actionsController.actionHints);


routes.get('/sipCall', sipCallController.call);
routes.get('/call/:typeCall/', sipCallController.callStatus);

export default routes;