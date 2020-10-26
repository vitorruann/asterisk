import express from 'express';

import actionsController from './controllers/actionsController';

const routes = express.Router();

routes.get('/extensionStatus', actionsController.actionExtenStatus);

export default routes;