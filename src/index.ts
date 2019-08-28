import * as Discord from "discord.js";
import * as ConfigFile from "./config";

const bot: Discord.Client = new Discord.Client();

bot.on('ready', () =>{

})

bot.login(ConfigFile.config.token);