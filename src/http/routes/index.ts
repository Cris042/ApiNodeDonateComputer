import { Router } from 'express';

import { donationRoutes } from "./donation.routes";

const routes = Router();

routes.use("/donation", donationRoutes );

export { routes };