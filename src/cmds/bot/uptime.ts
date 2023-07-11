import {CommandInteraction,CommandInteractionOptionResolver} from "discord.js";
import {ChasBot} from "../../typings/ChasBot";
import {Uptime} from "../util/uptime";

export default {
    name: 'uptime',
    description: 'How long has the bot been up?',
    options:[],
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver, c: ChasBot){
        return await i.reply({content: Uptime.hmsString, ephemeral:true})
    }
}