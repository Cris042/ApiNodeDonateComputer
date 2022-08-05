interface ICreateDonationDTO
{
    keyUser?: string
    zip: string;
    city: string;
    state: string;
    streetAddress: string;
    number: string;
    complement?: string;
    neighborhood: string;
    deviceCount: number;   
}

export { ICreateDonationDTO };