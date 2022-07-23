const request = require('supertest');

const app = 'http://localhost:3000';

it("Server is running ? ", async () => {
   
    const response = await request(app).get("/");
    expect(response.body.alive).toBe(true);
   

});