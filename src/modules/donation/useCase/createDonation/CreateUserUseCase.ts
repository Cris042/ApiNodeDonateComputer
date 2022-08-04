import { ICreateUserDTO } from "@modules/donation/dtos/ICreateUserDTO";
import { prisma } from '@database/prismaClient';
import * as EmailValidator from 'email-validator';
import { appError } from "@errors/appError";
import * as Yup from 'yup';

function  HandleCheckRequiredFields( user: ICreateUserDTO ) 
{
  let requiredFields: string[] = [];

  for (let item in user) 
  {
    if( !user[item] && item !== "email")    
       requiredFields.push(item);    
  }

  return requiredFields;
}

async function HandleCheckInputType( user : ICreateUserDTO )
{
  let isValid = true;
  let messageError = " ";

  let schema = Yup.object().shape
  ({
    name: Yup.string().min(3),
    email: Yup.string().notRequired(),
    phone: Yup.string().min(10).max(18),
  });

  try 
  {
    await schema.validate
    (
      { 
        name : user.name,email : user.email, phone : user.phone
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

function HandleValidateEmail( email : string ) 
{
   return EmailValidator.validate( email );
}
class CreateUserUseCase
{
  async execute({
    name,
    email,
    phone
  }: ICreateUserDTO )
  {
    const user: ICreateUserDTO = 
    { 
        name,
        email,
        phone
    }
   
    const checkFilds =  HandleCheckRequiredFields( user );
    if( checkFilds.length > 0 )
    {
        throw new appError
        (
          "Todos os campos obrigatórios de informações pessoais devem ser informados",
           checkFilds
        )
    }

    const responseType = HandleCheckInputType( user );
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

    const userExists = await prisma.user.findFirst({
      where: {
        phone: {
          equals: phone,
          mode: 'insensitive',
        },
      },
    });
  
    let response = [];

    if( !userExists )
    {
      let objUser = await prisma.user.create({
        data: 
        {
          name: user.name,
          email: user.email != null ? user.email : null,
          phone: user.phone,
        },
      })
       
      response.push( objUser.id );
    }

    return response;
  
  }
}

export { CreateUserUseCase };