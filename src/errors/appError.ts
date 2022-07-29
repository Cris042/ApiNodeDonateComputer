export class appError 
{
    public readonly message: string;
    public readonly statusCode: number;
    public readonly error: boolean;
  
    constructor( message: string, error = true, statusCode = 400,) 
    {
      this.error = error;
      this.message = message;
      this.statusCode = statusCode;
    }
}