import { ICreatedonationDTO } from "@modules/donation/dtos/ICreatedonationDTO";
import * as EmailValidator from 'email-validator';
import { appError } from "@errors/appError";
import * as Yup from 'yup';

type typeDevice =
{
  type: string; 
  condicion: string;
}

function HandleValidateEmail( email : string ) 
{
   return EmailValidator.validate( email );
}

async function HandleCheckInputType( donation : ICreatedonationDTO )
{
  let isValid = true;
  let messageError = " ";

  let schema = Yup.object().shape
  ({
    name: Yup.string().min(3),
    phone: Yup.string().min(10).max(18),
    zip: Yup.string().min(8).max(10),
    city: Yup.string().min(3),
    state: Yup.string().min(3),
    streetAddress: Yup.string().min(3),
    number: Yup.number().positive("O campo 'number' deve ser positivo.").integer("O campo deve ser um número inteiro."),
    neighborhood: Yup.string().min(3),
    deviceCount: Yup.number().positive("O campo 'deviceCount' deve ser positivo.").integer("O campo deve ser um número inteiro"),
  });

  try 
  {
    await schema.validate
    (
      { 
        name : donation.name, phone : donation.phone, zip: donation.zip, city : donation.city, state : donation.state, streetAddress : donation.streetAddress, 
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

function  HandleCheckRequiredFields( donation: ICreatedonationDTO ) 
{
  let requiredFields: string[] = [];

  for (let item in donation) 
  {
    if( !donation[item] && item !== "email" && item !== "complement")    
       requiredFields.push(item);    
  }

  if( donation.devices.length === 0 ) 
      requiredFields.push("devices");

  return requiredFields;
}

function  HandleCheckDevicesTypes(devices: typeDevice[]) 
{
  const devicesTypes = [ "notebook", "desktop", "netbook", "monitor", "impressora","scanner"];
  const devicesCondicion = [ "working", "notWorking", "broken"];

  for (let device of devices) 
  {
    if( !devicesTypes.includes( device.type.toLocaleLowerCase() ) ) 
      throw new appError( device.type.toLocaleLowerCase() + "  não e um tipo de device valido!");
    if( !devicesCondicion.includes( device.condicion.toLocaleLowerCase() ) )
      throw new appError( device.condicion.toLocaleLowerCase() + "  não e uma codinção de device valido!");
  }
}


class CreateDonationUseCase
{
  async execute({
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
  }: ICreatedonationDTO )
  {
    const donation: ICreatedonationDTO = 
    {
      name,
      phone,
      email,
      zip,
      city,
      state,
      streetAddress,
      number,
      neighborhood,
      complement,
      deviceCount,
      devices,
    }
   
    const checkFilds =  HandleCheckRequiredFields( donation );

    if( checkFilds.length > 0 )
    {
        throw new appError
        (
           "Todos os campos obrigatórios devem ser informados",
           checkFilds
        )
    }

    const response = HandleCheckInputType( donation );

    if( (await response).isValid == false )
    {
        throw new appError
        (
          "Dados Invalidos!" + (await response).messageError
        );
    }
    
    if( email != null && HandleValidateEmail(email) == false )
    {
        throw new appError
        (
          "E-mail invalido!"
        );
    }

    if( deviceCount != devices.length )
    {
        throw new appError
        (
           "A quantidade de equipamentos : " + deviceCount + 
           "  não está de acordo com as informações de equipamentos enviados : " + devices.length
        );
    }

    HandleCheckDevicesTypes( devices );
    
  }
}

export { CreateDonationUseCase };