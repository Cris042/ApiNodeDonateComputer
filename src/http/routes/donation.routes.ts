import { Router } from 'express';

import { CreateDonationController } from '@modules/donation/useCase/createDonation/createDonationController';

const DonationRoutes = Router();
const createController  = new CreateDonationController();

DonationRoutes.post( "/", createController.handle );


export { DonationRoutes };