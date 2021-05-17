import express from 'express';

import actionsController from './controllers/actionsController';

const routes = express.Router();

routes.get('/extensionStatus', actionsController.actionExtenStatus);
routes.get('/sipPeers', actionsController.actionSipPeers);
routes.get('/sipHints', actionsController.actionHints);
<<<<<<< HEAD
routes.get('/tip', actionsController.tipActions);
routes.get('/call', actionsController.tipActions);


=======
routes.get('/sipHangUp', actionsController.hangUpCall);
routes.get('/sipCall', actionsController.call);
>>>>>>> fa5dbe86f4f14f29630505e6555d82e0dc0c1e5d


export default routes;