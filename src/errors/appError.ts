export class appError 
{
    public readonly errorMessage: string;
    public readonly statusCode: number;
    public readonly error: boolean;
    public readonly requiredFields?: string;
  
    // class responsavel para fazer o tratamentos de error 
    constructor( errorMessage: string, requiredFields? , error = true, statusCode = 400) 
    {
      this.error = error;
      this.errorMessage = errorMessage;
      this.statusCode = statusCode;
      this.requiredFields = requiredFields;
    }
}