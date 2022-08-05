import { PrismaClient } from '@prisma/client';

//instanciado a classe do prisma que e reponsavel pelo banco de dados
export const prisma = new PrismaClient();
