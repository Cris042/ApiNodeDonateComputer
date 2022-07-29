import { App } from "@http/App";
import request from 'supertest';

describe("criar doação, verificar se o tipo do device", () => 
{
  it("retornar o status 400 quando  o tipo de device estiver incorreto", async () => 
  {
    const donation = 
    {
      name: "teste",
      phone: "(77) 7777-7777",
      zip: "7777-777",
      city: "Westminster",
      state: "Londres",
      streetAddress: "Baker Street",
      number: "221",
      neighborhood: "centro",
      deviceCount: 1,
      devices: 
      [
        {
          type: "smartwatch",
          condicion: "working",
        }
      ]
    };

    const response = await request(App)
      .post("/donation")
      .send(donation)
      .set("Accept", "application/json")
      .expect(400);

    expect(response.body.message).toBe("smartwatch  não e um tipo de device valido!");
  });


});