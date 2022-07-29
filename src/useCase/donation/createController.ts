import { Request, Response } from "express";
import { container } from "tsyringe";

import { createService } from "@useCase/donation/createService";

class CreateController 
{
  async handle( request: Request, response: Response ): Promise<Response> 
  {

    const 
    { 
      name, email, phone, zip, city, state, streetAddress, number, complement, neighborhood, deviceCount, devices 
    } = request.body;

    const createServiceObj = container.resolve( createService );  
    
    await createServiceObj.execute
    ({ 
      name,
      email,
      phone,
      zip,
      city,
      state,
      streetAddress,
      number,
      complement,
      neighborhood,
      deviceCount,
      devices
    }); 

    return response.status(200).json({ success: true }).send();

  } 
}

export { CreateController  };

