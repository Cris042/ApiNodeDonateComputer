const request = require('supertest');

// const app = 'http://localhost:3000';

const app = require('./app');

it("Server is running ? ", async () => {
   
    const response = await request(app).get("/");
    expect(response.body.alive).toBe(true);
   

});