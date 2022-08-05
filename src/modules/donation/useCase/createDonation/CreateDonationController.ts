import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateDonationUseCase } from "@modules/donation/useCase/createDonation/CreateDonationUseCase";
import { CreateDevicesUseCase } from "@modules/donation/useCase/createDonation/CreateDevicesUseCase";
import { CreateUserUseCase } from "@modules/donation/useCase/createDonation/CreateUserUseCase";

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
    const CreateUserUseCaseObj = container.resolve( CreateUserUseCase );
    const CreateDevicesUseCaseObj = container.resolve( CreateDevicesUseCase );

    //metodo para criar o usuario
    const reponseUse = await CreateUserUseCaseObj.execute
    ({
       name, email, phone
    })
    
    //metodo para criar a doação 
    const responseDonation = await CreateDonationObj.execute
    ({ 
       keyUser : phone, zip, city, state, streetAddress, number, complement, neighborhood, deviceCount
    }); 

    //metodo para criar os devices
    const responseDevices = await CreateDevicesUseCaseObj.execute
    ({ 
       devices,deviceCount, idDonation : responseDonation
    })

    //criando a messagem de sucesso, informado os objetos cadastrados
    let alertCreate = [];

    if( reponseUse.length != 0 ) 
      alertCreate.push( "Usuarios criados  : " + reponseUse );
   
    alertCreate.push("Doações criadas :  " + responseDonation );
    alertCreate.push("Devices criados :  " + responseDevices );


    return response.status(200).json({ alertCreate }).send();

  } 
}

export { CreateDonationController };

