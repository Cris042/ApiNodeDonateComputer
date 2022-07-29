import { app } from "@http/app";
import request from 'supertest';

describe("criar doação, verificar se o numero de devices esta iqual a quantidade de devices", () => 
{ 
  it("retornar o status 400 quando o numero de devices estive diferente da quantidade de devices ", async ( ) => 
  {
    const donation = 
    {
      name: "teste",
      email: "teste@email.com",
      phone: "(77) 7777-7777",
      zip: "7777-777",
      city: "Westminster",
      state: "Londres",
      streetAddress: "Baker Street",
      number: "221",
      complement: "b",
      neighborhood: "centro",
      deviceCount: 2,
      devices: 
      [
        {
          type: "notebook",
          condition: "working",
        }
      ]
    };

    const response = await request(app)
      .post("/donation")
      .send(donation)
      .set("Accept", "application/json")
      .expect(400);

      expect(response.body.message).toBe
      (
        "A quantidade de equipamentos : 2  não está de acordo com as informações de equipamentos enviados : 1"
      );
  });

});