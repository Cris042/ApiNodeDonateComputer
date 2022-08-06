import { prisma } from '@database/prismaClient';


class ListDonationUseCase
{
  async execute() 
  {

    //vai pegar todas doação e vai incluir o user e os devices com base na chave estrangeira
    const donationRequest = await prisma.donation.findMany
    ({
       orderBy : {
          created_at : 'desc' 
       },
       include : 
       {
          user: {},
          devices:{},
       },
    });

    let donation = [];
    let donationObj : any;


    for( let item in donationRequest )
    {
       donationObj = donationRequest[item];
       donation.push( donationObj );
    }

    return donation;
  }
}

export { ListDonationUseCase };