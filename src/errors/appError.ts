export class appError 
{
    public readonly message: string;
    public readonly statusCode: number;
    public readonly error: boolean;
    public readonly requiredFields?: string;
  
    constructor( message: string, requiredFields? , error = true, statusCode = 400) 
    {
      this.error = error;
      this.message = message;
      this.statusCode = statusCode;
      this.requiredFields = requiredFields;
    }
}