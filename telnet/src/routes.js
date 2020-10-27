import express from 'express';

import actionsController from './controllers/actionsController';

const routes = express.Router();

routes.get('/extensionStatus', actionsController.actionExtenStatus);
routes.get('/sipPeers', actionsController.actionSipPeers);
routes.get('/registered', actionsController.actionRegistered);


export default routes;