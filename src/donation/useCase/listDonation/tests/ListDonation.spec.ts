import { App } from "@http/app";
import request from 'supertest';

describe("listar doações", () => 
{
  it("retornar o status 200 ", async ( ) => 
  {
     const response = await request(App).get("/donation/");
     expect(response.statusCode).toBe(200);
  });
  
});