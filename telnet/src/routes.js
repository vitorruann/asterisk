import express from 'express';

import actionsController from './controllers/actionsController';

const routes = express.Router();

routes.get('/extensionStatus', actionsController.actionExtenStatus);
routes.get('/sipPeers', actionsController.actionSipPeers);
routes.get('/sipHints', actionsController.actionHints);
routes.get('/sipHangUp', actionsController.hangUpCall);
routes.get('/sipCall', actionsController.call);


export default routes;