import { Router } from 'express';

import { DonationRoutes } from "./Donation.routes";

const routes = Router();

routes.get('/', function(req, res) 
{
    res.status(201).json({ alive: true }).send();
});

routes.use("/donation", DonationRoutes );

export { routes };