import "reflect-metadata";
import "express-async-errors";
import * as dotenv from 'dotenv';
import swaggerUi from "swagger-ui-express";
import express, { NextFunction, Request, Response } from "express";

import { routes } from "./routes/index";
import { appError } from "@errors/appError";
import swaggerFile from "@swagger";

//criando o servidor e aplicando as routas, variaves de ambiente, headers e os tratamentos de erros
var cors = require('cors');
dotenv.config()

const App = express();

require('dotenv').config();

App.use(cors());
App.use(cors({ origin: '*' }));
App.use(cors({ exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'], }));
App.use(cors({ credentials: true, }));

App.use("/docs", swaggerUi.serve, swaggerUi.setup( swaggerFile ));
App.use( express.json() );
App.use( routes );

App.use
(
    (err: Error, request: Request, response: Response, next: NextFunction) => 
    {
  
      if (err instanceof appError) 
      {          
          return  response.status(err.statusCode).json
          ({
            erro: err.error,
            errorMessage: err.errorMessage,     
            requiredFields: err.requiredFields,
          })            
      }
      return response.status(500).json(
      {
  
        status: "error",
        errorMessage: `Internal server error - ${err.message}`,
  
      });
  
    }
);

export { App };