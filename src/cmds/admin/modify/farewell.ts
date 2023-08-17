import {CommandInteraction, CommandInteractionOptionResolver, GuildMember} from "discord.js";
import {ChasBot} from "../../../typings/ChasBot";
import {hasAdminPermissions} from "../../util/hasAdmin";
import {HydratedDocument} from "mongoose";
import {IGuild, MGuild} from "../../../models/guild";

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

        let farewell_text = options.getString('text',true).slice(0,150)

        let guild:HydratedDocument<IGuild> = await MGuild.findByGuildId(i.guildId)
        guild.messages.goodbye = farewell_text

        await guild.save()

        await i.reply({content:'Successfully changed the farewell text.'})
    }
}