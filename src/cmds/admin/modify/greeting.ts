import {CommandInteraction, CommandInteractionOptionResolver, GuildMember} from "discord.js";
import {ChasBot} from "../../../typings/ChasBot";
import {hasAdminPermissions} from "../../util/hasAdmin";

export default {
    name: 'greeting',
    description: 'Sets the greeting message for the welcome/goodbye image',
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

        let greeting_text = options.getString('text')?.slice(0,150)
        await c.GuildDB.push(`/${i.guild?.id}/messages/greeting`,greeting_text)

        await i.reply({content:'Successfully changed the greeting text.'})
    }
}