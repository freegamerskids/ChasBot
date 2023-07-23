import {CommandInteraction,CommandInteractionOptionResolver,EmbedBuilder} from "discord.js";
import {ChasBot} from "../../typings/ChasBot";
import { request } from "undici";

export default {
    name: 'action',
    description: 'action',
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
        let cmd
        if (commands[commandName.toLowerCase()]){
            cmd = commands[commandName.toLowerCase()]
        } else {
            try {
                cmd = await c.GuildDB.getData(`/${i.guildId}/custom_commands/action/${commandName.toLowerCase()}`)
            } catch (e) {
                return await i.reply({content:'Action not found.', ephemeral:true})
            }
        }

        let user2 = options.getUser('user',true)
        let gif = cmd.gifs[Math.floor(Math.random() * cmd.gifs.length)];

        let gif_req = await request(gif)

        let embed = new EmbedBuilder()
            .setDescription(cmd.prompt.replace('{u1}', i.user.id).replace('{u2}', user2.id))
            .setImage(gif_req.headers['location'] as string)
            .setColor(cmd.embed_color)

        await i.reply({ embeds:[embed] })
    }
}