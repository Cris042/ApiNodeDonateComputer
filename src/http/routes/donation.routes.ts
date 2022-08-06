import { Router } from 'express';

import { CreateDonationController } from '@donation/useCase/createDonation/CreateDonationController';
import { ListDonationController } from '@donation/useCase/listDonation/ListDonationController';

const DonationRoutes = Router();
const createController  = new CreateDonationController();
const listControllers = new ListDonationController();

DonationRoutes.post( "/", createController.handle );
DonationRoutes.get( "/", listControllers.handle );


export { DonationRoutes };