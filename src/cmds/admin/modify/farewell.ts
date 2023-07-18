import {CommandInteraction, CommandInteractionOptionResolver, GuildMember} from "discord.js";
import {ChasBot} from "../../../typings/ChasBot";
import {hasAdminPermissions} from "../../util/hasAdmin";

export default {
    name: 'farewell',
    description: 'Sets the farewell (goodbye) message for the welcome/goodbye image',
    options:[
        {
            name: 'text',
            description: 'message in the image',
            required: true,
            type: 3
        }
    ], // https://discord.com/developers/docs/interactions/application-commands#slash-commands
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver, c: ChasBot){
        if (!await hasAdminPermissions(i.member as GuildMember,c)) return await i.reply({ content:'You shall not pass!', ephemeral:true })

        let farewell_text = options.getString('text')?.slice(0,150)
        await c.GuildDB.push(`/${i.guild?.id}/messages/goodbye`,farewell_text)

        await i.reply({content:'Successfully changed the farewell text.'})
    }
}