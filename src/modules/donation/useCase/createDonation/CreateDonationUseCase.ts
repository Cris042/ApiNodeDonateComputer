import { ICreateDonationDTO } from "@modules/donation/dtos/ICreatedonationDTO";
import { prisma } from '@database/prismaClient';
import { appError } from "@errors/appError";
import * as Yup from 'yup';

async function HandleCheckInputType( donation : ICreateDonationDTO )
{
  let isValid = true;
  let messageError = " ";

  let schema = Yup.object().shape
  ({
    zip: Yup.string().required().min(8).max(10),
    city: Yup.string().required().min(3),
    state: Yup.string().required().min(3),
    streetAddress: Yup.string().required().min(3),
    number: Yup.number().required().positive("O campo 'number' deve ser positivo.").integer("O campo deve ser um número inteiro."),
    complement : Yup.string().notRequired().min(3),
    neighborhood: Yup.string().required().min(3),
    deviceCount: Yup.number().required().positive("O campo 'deviceCount' deve ser positivo.").integer("O campo deve ser um número inteiro"),
  });

  try 
  {
    await schema.validate
    (
      { 
        zip: donation.zip, city : donation.city, state : donation.state, streetAddress : donation.streetAddress, 
        number : donation.number, neighborhood : donation.neighborhood, deviceCount: donation.deviceCount 
      }
    );
  }
  catch (err) 
  {
     isValid = false;
     messageError = err.errors;
  }

  return { isValid, messageError }

}

class CreateDonationUseCase
{
  async execute({
    keyUser,
    zip,
    city,
    state,
    streetAddress,
    number,
    complement,
    neighborhood,
    deviceCount, 
  }: ICreateDonationDTO )
  {
    const donation: ICreateDonationDTO = 
    { 
      keyUser,
      zip,
      city,
      state,
      streetAddress,
      number,
      neighborhood,
      complement,
      deviceCount,  
    }
   
    const response = HandleCheckInputType( donation );

    if( (await response).isValid == false )
    {
        throw new appError
        (
          "Dados Invalidos!" +"  "+ (await response).messageError
        );
    }
      
    const objDonation = await prisma.donation.create({
      data: {
        key_user: donation.keyUser,
        zip: donation.zip,
        city: donation.city,
        state: donation.state,
        streetAddress: donation.streetAddress,
        number: String( donation.number ),
        neighborhood : donation.neighborhood,
        complement : donation.complement,
        deviceCount : String( donation.deviceCount ),
      },
    });

    return objDonation.id;
  
  }
}

export { CreateDonationUseCase };