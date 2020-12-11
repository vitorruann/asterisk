import express from 'express';

import actionsController from './controllers/actionsController';

const routes = express.Router();

routes.get('/extensionStatus', actionsController.actionExtenStatus);
routes.get('/sipPeers', actionsController.actionSipPeers);
routes.get('/sipHints', actionsController.actionHints);


export default routes;