import { App } from "@http/app";
import request from 'supertest';

describe("criar doação", () => 
{
  it("retornar o status 200 ", async ( ) => 
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
      deviceCount: 1,
      devices: 
      [
        {
          type: "notebook",
          condition: "working",
        }
      ]
    };

    const response = await request(App)
      .post("/donation/")
      .send(donation)
      .set("Accept", "application/json")
      .expect(200);
  });
});