import { ICreateUserDTO } from "@modules/donation/dtos/ICreateUserDTO";
import { prisma } from '@database/prismaClient';
import * as EmailValidator from 'email-validator';
import { appError } from "@errors/appError";
import * as Yup from 'yup';

function HandleValidateEmail( email : string ) 
{
   return EmailValidator.validate( email );
}

async function HandleCheckInputType( user : ICreateUserDTO )
{
  let isValid = true;
  let messageError = " ";

  let schema = Yup.object().shape
  ({
    name: Yup.string().required().min(3),
    email: Yup.string().notRequired(),
    phone: Yup.string().required().min(10).max(18),
  });

  try 
  {
    await schema.validate
    (
      { 
        name : user.name, phone : user.phone
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

class CreateUserUseCase
{
  async execute({
    name,
    email,
    phone
  }: ICreateUserDTO )
  {
    const donation: ICreateUserDTO = 
    { 
        name,
        email,
        phone
    }
   
    const response = HandleCheckInputType( donation );

    if( (await response).isValid == false )
    {
        throw new appError
        (
          "Dados Invalidos!" +"  "+ (await response).messageError
        );
    }
    
    if( email != null && HandleValidateEmail(email) == false )
    {
        throw new appError
        (
          "E-mail invalido!"
        );
    }

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
        await prisma.user.create({
          data: {
            name: donation.name,
            email: donation.email,
            phone: donation.phone,
          },
        })
    }
  
  }
}

export { CreateUserUseCase };