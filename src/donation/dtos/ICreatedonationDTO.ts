type device = 
{
    type: string;
    condicion: string;
};
  
interface ICreatedonationDTO
{
    name: string;
    email?: string;
    phone: string;
    zip: string;
    city: string;
    state: string;
    streetAddress: string;
    number: number;
    complement?: string;
    neighborhood: string;
    deviceCount: number;
    devices: device[];
}

export { ICreatedonationDTO };