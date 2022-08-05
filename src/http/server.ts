import { App } from "./app";

// verificando se esta pegando a variavel de ambiente
// console.log( process.env.DATABASE_URL );

//instanciado o server na porta 3000 ou na porta disponivel no heroku
App.listen(process.env.PORT || 3000, function()
{
    console.log("Express server listening on port %d in %s mode", this.address().port, App.settings.env);
});