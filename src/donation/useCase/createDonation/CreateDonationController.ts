import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateDonationUseCase } from "@donation/useCase/createDonation/CreateDonationUseCase";

class CreateDonationController 
{
  async handle( request: Request, response: Response ): Promise<Response> 
  {

   //pegando os valores necessarios na request
    const 
    { 
       name, email, phone, zip, city, state, streetAddress, number, complement, neighborhood, deviceCount, devices 
    } = request.body;

    //instanciado as classes responsavel por chamar os metodos
    const CreateDonationObj = container.resolve( CreateDonationUseCase );  

    //metodo para criar a doação 
    const responseDonation = await CreateDonationObj.execute
    ({ 
       name, email, phone, zip, city, state, streetAddress, number, complement, neighborhood, deviceCount, devices
    }); 

    return response.status(200).json({ responseDonation }).send();

  } 
}

export { CreateDonationController };

