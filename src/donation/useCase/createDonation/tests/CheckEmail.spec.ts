import { App } from "@http/app";
import request from 'supertest';

describe("criar doação, verificar se o E-mail e valido", () => 
{
  it("retornar o status 400, quando o E-mail for invalido", async () => 
  {
    const donation = 
    {
      name: "teste",
      email: "teste@emailcom",
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
          condicion: "working",
        }
      ]
    };

    const response = await request(App)
      .post("/donation")
      .send(donation)
      .set("Accept", "application/json")
      .expect(400);

      expect(response.body.errorMessage).toBe("E-mail invalido!");
  });

 
});