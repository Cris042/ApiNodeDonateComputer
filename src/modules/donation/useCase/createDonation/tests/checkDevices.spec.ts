import { App } from "@http/app";
import request from 'supertest';

describe("criar doação, verificar se existe algun device", () => 
{
  it("retornar o status 400 quando a quantidades de device for igual a 0", async () => 
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
      deviceCount: 0,
      devices: 
      [
      ]
    };

    const response = await request(App)
      .post("/donation")
      .send(donation)
      .set("Accept", "application/json")
      .expect(400);

      expect(response.body.message).toBe
      (
        "Todos os campos obrigatórios devem ser informados"
      );
  });

});