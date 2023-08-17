import {CommandInteraction, CommandInteractionOptionResolver, GuildMember} from "discord.js";
import {ChasBot} from "../../../typings/ChasBot";
import {hasAdminPermissions} from "../../util/hasAdmin";
import {isUrl} from "../../util/urlUtil";
import {HydratedDocument} from "mongoose";
import {IGuild, MGuild} from "../../../models/guild";

export default {
    name: 'background',
    description: 'Sets the background url for the welcome/goodbye image',
    options:[
        {
            name: 'url',
            description: 'background URL',
            required: true,
            type: 3
        }
    ], // https://discord.com/developers/docs/interactions/application-commands#slash-commands
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver, c: ChasBot){
        if (!await hasAdminPermissions(i.member as GuildMember,c)) return await i.reply({ content:'You shall not pass!', ephemeral:true })

        let background_url = options.getString('url')
        if (!isUrl(background_url as string)) return await i.reply({content:'Not an valid URL. Please try again with an actual URL.', ephemeral: true})

        let guild:HydratedDocument<IGuild> = await MGuild.findByGuildId(i.guildId)
        guild.background = background_url

        await guild.save()

        await i.reply({content:'Successfully changed background URL.'})
    }
}