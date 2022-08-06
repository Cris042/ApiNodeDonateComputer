import { ICreatedonationDTO } from "donation/dtos/ICreatedonationDTO";
import * as EmailValidator from 'email-validator';
import * as Yup from 'yup';

import { prisma } from '@database/prismaClient';
import { appError } from "@errors/appError";


//função para verificar se o campos origatorios foram preencidos
function  HandleCheckRequiredFields( donation: ICreatedonationDTO) 
{
  let requiredFields: string[] = [];

  for (let item in donation) 
  {
    if( !donation[item] && item !== "complement"  && item !== "email")    
       requiredFields.push(item);        
  }

  if( donation.devices.length == 0 ) 
       requiredFields.push("devices");

  return requiredFields;
}

//função para verificar se os campos obrigatorios foram enviado no formato certo 
async function HandleCheckInputType( donation : ICreatedonationDTO )
{
  let isValid = true;
  let messageError = " ";

  let schema = Yup.object().shape
  ({
    name: Yup.string().min(3),
    email: Yup.string().notRequired(),
    phone: Yup.string().min(10).max(18),
    zip: Yup.string().min(8).max(10),
    city: Yup.string().min(3),
    state: Yup.string().min(2),
    streetAddress: Yup.string().min(3),
    number: Yup.number().min(0),
    complement : Yup.string().notRequired().min(1),
    neighborhood: Yup.string().min(3),
    deviceCount: Yup.number().positive("O campo 'deviceCount' deve ser positivo.").integer("O campo deve ser um número inteiro"),
  });

  try 
  {
    await schema.validate
    (
      { 
        name: donation.name.trim(), email : donation.email.trim(), phone : donation.phone.trim(), zip : donation.zip.trim(), 
        city : donation.city.trim(), state : donation.state.trim(), streetAddress : donation.streetAddress.trim(), number : donation.number, 
        complement : donation.complement.trim(),neighborhood : donation.neighborhood.trim(), deviceCount: donation.deviceCount 
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

//função para verificar se os campos [ type e condicion ] foram preencidos e verificar se eles estão no formato certo 
function  HandleCheckDevicesTypes( donation: ICreatedonationDTO ) 
{
  const devicesTypes = [ "notebook", "desktop", "netbook", "monitor", "impressora","scanner"];
  const devicesCondicion = [ "working", "notworking", "broken"];

  for (let device of donation.devices) 
  {
    if( !devicesTypes.includes( device.type.toLocaleLowerCase() ) ) 
      throw new appError( device.type.toLocaleLowerCase() + "  não e um tipo de device valido!");
    if( !devicesCondicion.includes( device.condicion.toLocaleLowerCase() ) )
      throw new appError( device.condicion.toLocaleLowerCase() + "  não e uma codinção de device valido!");
  }
}

function HandleValidateEmail( email : string ) 
{
   return EmailValidator.validate( email );
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
    devices,
 
  } : ICreatedonationDTO)
  {
    //criadno objeto com base no DTO
    const donation: ICreatedonationDTO = 
    { 
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
      devices,
    }
     
    const checkFilds =  HandleCheckRequiredFields( donation );
    if( checkFilds.length > 0 )
    {
        throw new appError
        (
           "Todos os campos obrigatórios devem ser informados!",
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

    HandleCheckDevicesTypes( donation );
      
  
    //criando o usuario no banco de dados
    let responseUser = [];
    const userExists = await prisma.user.findFirst({
      where: {
        phone: {
          equals: phone,
          mode: 'insensitive',
        },
      },
    });
  

    if( !userExists )
    {
      let objUser = await prisma.user.create({
        data: 
        {
          name: donation.name,
          email: donation.email != null ? donation.email : "",
          phone: donation.phone,
        },
      })
       
      responseUser.push( objUser.id );
    }

    //criando a donation no banco de dados
    let responseDonation = [];
    const objDonation = await prisma.donation.create({
      data: 
      {
        key_user: phone,
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

    responseDonation.push( objDonation.id );

    //criando os devices no banco de dados
    let responseDevices = [];
    for (let item in devices) 
    {
      let objDevices = await prisma.devices.create
      ({    
        data: 
        {    
          id_donation : objDonation.id,
          type: devices[item].type,
          condicion: devices[item].condicion,   
        },
      });

      responseDevices.push( objDevices.id_donation );
    }

    
    //criando a messagem de sucesso, informado os objetos cadastrados
    let alertCreate = [];

    if( responseUser.length != 0 ) 
      alertCreate.push( "Usuarios criados  : " + responseUser);
   
    alertCreate.push("Doações criadas :  " + responseDonation );
    alertCreate.push("Devices criados :  " + responseDevices );



    return alertCreate;
  
  }
}

export { CreateDonationUseCase };