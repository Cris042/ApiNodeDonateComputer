import { ICreatedonationDTO } from "@modules/donation/dtos/ICreatedonationDTO";
import { requiredFieldsError } from "@errors/requiredFieldsError";
import { appError } from "@errors/appError";

type typeDevice =
{
  type: string; 
  condicion: string;
}

function HandleValidateEmail( email : string ) 
{
   var re = /\S+@\S+\.\S+/;
   return re.test( email );
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
    if( !devicesTypes.includes( device.type ) ) 
      throw new appError( device.type + "  não e um tipo de device valido!");
    if( !devicesCondicion.includes( device.condicion ) )
      throw new appError( device.condicion + "  não e uma codinção de device valido!");
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
        throw new requiredFieldsError
        (
           "Todos os campos obrigatórios devem ser informados",
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

    if( email != null &&  HandleValidateEmail( email ) == false )
    {
        throw new appError
        (
          "E-mail invalido!"
        );
    }

    HandleCheckDevicesTypes( devices );
    
  }
}

export { CreateDonationUseCase };