import { Router } from 'express';

import { CreateController } from '@useCase/donation/createController'

const donationRoutes = Router();
const createController  = new CreateController();

donationRoutes.post( "/", createController.handle );


export { donationRoutes };