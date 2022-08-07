import { Router } from 'express';

import { CreateDonationController } from '@donation/useCase/createDonation/CreateDonationController';
import { ListDonationController } from '@donation/useCase/listDonation/ListDonationController';

const routes = Router();
const createController  = new CreateDonationController();
const listControllers = new ListDonationController();

//criando as rotas
routes.get('/', function(req, res) 
{
    res.status(201).json({ alive: true }).send();
});

routes.post( "/donation", createController.handle );
routes.get( "/donation", listControllers.handle );

export { routes };