import { ICreateDonationDTO } from "@modules/donation/dtos/ICreatedonationDTO";
import { prisma } from '@database/prismaClient';
import { appError } from "@errors/appError";
import * as Yup from 'yup';

function  HandleCheckRequiredFields(donation: ICreateDonationDTO ) 
{
  let requiredFields: string[] = [];

  for (let item in donation) 
  {
    if( !donation[item] && item !== "complement")    
       requiredFields.push(item);    
  }

  return requiredFields;
}

async function HandleCheckInputType( donation : ICreateDonationDTO )
{
  let isValid = true;
  let messageError = " ";

  let schema = Yup.object().shape
  ({
    zip: Yup.string().min(8).max(10),
    city: Yup.string().min(3),
    state: Yup.string().min(3),
    streetAddress: Yup.string().min(3),
    number: Yup.number().positive("O campo 'number' deve ser positivo.").integer("O campo deve ser um número inteiro."),
    complement : Yup.string().notRequired().min(1),
    neighborhood: Yup.string().min(3),
    deviceCount: Yup.number().positive("O campo 'deviceCount' deve ser positivo.").integer("O campo deve ser um número inteiro"),
  });

  try 
  {
    await schema.validate
    (
      { 
        zip: donation.zip, city : donation.city, state : donation.state, streetAddress : donation.streetAddress, 
        number : donation.number, complement : donation.complement, neighborhood : donation.neighborhood, deviceCount: donation.deviceCount 
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
     
    const checkFilds =  HandleCheckRequiredFields( donation );
    if( checkFilds.length > 0 )
    {
        throw new appError
        (
           "Todos os campos obrigatórios de doações devem ser informados",
           checkFilds
        )
    }

    const responseType = HandleCheckInputType( donation );
    if( (await responseType).isValid == false )
    {
        throw new appError
        (
          "Dados Invalidos!" +"  "+ (await responseType).messageError
        );
    }
      
    const objDonation = await prisma.donation.create({
      data: 
      {
        key_user: donation.keyUser,
        zip: donation.zip,
        city: donation.city,
        state: donation.state,
        streetAddress: donation.streetAddress,
        number: String( donation.number ),
        neighborhood : donation.neighborhood,
        complement : donation.complement !== undefined ? donation.complement : "",
        deviceCount : String( donation.deviceCount ),
      },
    });

    return objDonation.id;
  
  }
}

export { CreateDonationUseCase };