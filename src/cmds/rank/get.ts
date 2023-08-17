import {CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder} from "discord.js";
import {ChasBot} from "../../typings/ChasBot";
import {MGuild} from "../../models/guild";

export default {
    name: 'get',
    description: 'Gets the rank info of the user specified (or yourself)',
    options:[
        {
            name: 'user',
            description: 'The user you want to see the rank of',
            type: 6,
            required: false
        }
    ],
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver, c: ChasBot){
        const user = options.getUser('user',false) || i.user

        let user_rank = (await MGuild.findByGuildId(i.guildId).select('ranks')).ranks.find(r => r.userId == user.id)
        if (!user_rank) return await i.reply({content:'Cannot find the user.', ephemeral:true})

        let embed = new EmbedBuilder({title: `${user == i.user ? 'Your' : `${user.username}'s`} info`})
            .setColor('Random')
            .setThumbnail(user.displayAvatarURL({ extension:'png', size: 128 }))
            .addFields([{
                name: 'Info',
                value: `Level: \`${user_rank.level}\`
                XP: \`${user_rank.xp}/${user_rank.xpNeeded}\``
            }])

        return await i.reply({embeds:[embed]})
    }
}