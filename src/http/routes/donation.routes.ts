import { Router } from 'express';

import { CreateDonationController } from '@modules/donation/useCase/createDonation/CreateDonationController';

const DonationRoutes = Router();
const createController  = new CreateDonationController();

DonationRoutes.post( "/", createController.handle );


export { DonationRoutes };