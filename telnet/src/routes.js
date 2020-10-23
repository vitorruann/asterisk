import express from 'express';

import actionsController from './controllers/actionsController';

const routes = express.Router();

routes.get('/', actionsController.actionExten);

export default routes;