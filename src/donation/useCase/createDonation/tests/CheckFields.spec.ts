import { App } from "@http/app";
import request from 'supertest';

describe("criar doação, verificar se existe algun campo vazio", () => 
{
  it("retornar o status 400 quando existir algun campo vazio", async () => 
  {
    const donation = 
    {
      name: "teste",
      email: "teste@email.com",
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

      expect(response.body.errorMessage).toBe(
        "Todos os campos obrigatórios devem ser informados!"
      );
  });
  
});