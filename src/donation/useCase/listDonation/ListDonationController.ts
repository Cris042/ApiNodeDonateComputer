import { Request, Response } from 'express';
import { container } from "tsyringe";

import { ListDonationUseCase } from './ListDonationUseCase';

class ListDonationController
{
  async handle(request: Request, response: Response) {
   
    const listDonationUseCase = container.resolve( ListDonationUseCase);  

    const donation = await listDonationUseCase.execute( );

    return response.json( {donation} );
  }
}

export { ListDonationController };