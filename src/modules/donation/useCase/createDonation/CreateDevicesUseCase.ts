import { ICreateDevicesDTO } from "@modules/donation/dtos/ICreateDevicesDTO";
import { prisma } from '@database/prismaClient';
import { appError } from "@errors/appError";

function  HandleCheckRequiredFields( devices: ICreateDevicesDTO[] ) 
{
  let requiredFields: string[] = [];

  if( devices.length === 0 ) 
      requiredFields.push("devices");

  return requiredFields;
}

function  HandleCheckDevicesTypes( devices: ICreateDevicesDTO[] ) 
{
  const devicesTypes = [ "notebook", "desktop", "netbook", "monitor", "impressora","scanner"];
  const devicesCondicion = [ "working", "notworking", "broken"];

  for (let device of devices) 
  {
    if( !devicesTypes.includes( device.type.toLocaleLowerCase() ) ) 
      throw new appError( device.type.toLocaleLowerCase() + "  não e um tipo de device valido!");
    if( !devicesCondicion.includes( device.condicion.toLocaleLowerCase() ) )
      throw new appError( device.condicion.toLocaleLowerCase() + "  não e uma codinção de device valido!");
  }
}


class CreateDevicesUseCase
{
  async execute({
     devices,
     deviceCount,
     idDonation
  })
  {  

    const checkFilds =  HandleCheckRequiredFields( devices );
    if( checkFilds.length > 0 )
    {
        throw new appError
        (
           "Todos os campos origatórios de devices devem ser informados",
           checkFilds
        )
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

    let response = [];

    for (let item in devices) 
    {
      let objDevices = await prisma.devices.create
      ({    
        data: 
        {    
          id_donation : idDonation,
          type: devices[item].type,
          condicion: devices[item].condicion,   
        },
      });

      response.push( objDevices.id_donation );
    }

    return response;
  
  }
}

export { CreateDevicesUseCase };