import express from 'express';

import actionsController from './controllers/actionsController';
import sipCallController from './controllers/sipCallController';

const routes = express.Router();

routes.get('/extensionStatus', actionsController.actionExtenStatus);
routes.get('/sipPeers', actionsController.actionSipPeers);
routes.get('/sipHints', actionsController.actionHints);

routes.get('/sipHangUp', actionsController.hangUpCall);
routes.get('/sipHangOut', actionsController.hangOutCall);
routes.get('/sipCall', actionsController.call);

routes.get('/newCall', sipCallController.incomingCall);

export default routes;