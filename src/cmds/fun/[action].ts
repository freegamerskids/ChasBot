import {CommandInteraction,CommandInteractionOptionResolver,EmbedBuilder} from "discord.js";
import {ChasBot} from "../../typings/ChasBot";
import console from '../../util/logger'
import { request } from "undici";

export default {
    name: 'action', // the command name
    description: 'action', // description example
    options:[
        {
            name: 'user',
            description: "the user you want to perform the action on",
            type: 6,
            required: true
        }
    ], // too long to explain, https://discord.com/developers/docs/interactions/application-commands#slash-commands
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver, c: ChasBot){
        const commands = require('./actionConfig.json')
        const commandName = options.getSubcommand()
        const {gifs, prompt, embed_color} = commands[commandName.toLowerCase()]

        let user2 = options.getUser('user',true)
        let gif = gifs[Math.floor(Math.random() * gifs.length)];

        let gif_req = await request(gif)

        let embed = new EmbedBuilder()
            .setDescription(prompt.replace('{u1}', i.user.id).replace('{u2}', user2.id))
            .setImage(gif_req.headers['location'] as string)
            .setColor(embed_color)

        await i.reply({ embeds:[embed] })
    }
}