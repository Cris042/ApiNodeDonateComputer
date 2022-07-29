import { App } from "./app";

App.listen(process.env.PORT || 3000, function()
{
    console.log("Express server listening on port %d in %s mode", this.address().port, App.settings.env);
});