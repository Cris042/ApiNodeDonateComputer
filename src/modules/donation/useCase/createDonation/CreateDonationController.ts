import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateDonationUseCase } from "@modules/donation/useCase/createDonation/CreateDonationUseCase";

class CreateDonationController 
{
  async handle( request: Request, response: Response ): Promise<Response> 
  {

    const 
    { 
       name, email, phone, zip, city, state, streetAddress, number, complement, neighborhood, deviceCount, devices 
    } = request.body;

    const CreateDonationObj = container.resolve( CreateDonationUseCase );  
    
    await CreateDonationObj.execute
    ({ 
       name, email, phone, zip, city, state, streetAddress, number, complement, neighborhood, deviceCount, devices
    }); 

    return response.status(200).json({ success: true }).send();

  } 
}

export { CreateDonationController };

