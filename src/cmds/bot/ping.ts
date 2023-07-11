import {CommandInteraction,CommandInteractionOptionResolver} from "discord.js";
import {ChasBot} from "../../typings/ChasBot";

export default {
    name: 'ping',
    description: 'How fast does the bot respond?',
    options:[],
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver, c: ChasBot){
        return await i.reply({content: `Latency: \`${Date.now() - i.createdTimestamp}ms\`; Websocket latency: \`${i.client.ws.ping}ms\``, ephemeral:true})
    }
}