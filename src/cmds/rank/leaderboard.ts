import {CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder} from "discord.js";
import {ChasBot} from "../../typings/ChasBot";
import {MGuild} from "../../models/guild";

export default {
    name: 'leaderboard',
    description: 'Gets the rank leaderboard',
    options:[],
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver, c: ChasBot){
        let {ranks} = await MGuild.findByGuildId(i.guildId).select('ranks')
        if (!ranks) return await i.reply({content:'Seems like this server is a ghost town.', ephemeral:true})

        let embed = new EmbedBuilder({title: `${i.guild.name}`})
            .setAuthor({name:'Leaderboard'})
            .setColor('Random')
            .setThumbnail(i.guild.iconURL({ extension: 'png', size: 128 }))

        //@ts-ignore
        const sortable: {userId:string,level:number,xp:number,xpNeeded:number}[] = ranks.sort(([_,__,a,],[___,____,b,]) => b - a)

        for (let i = 0; i < 10; i++) {
            if (!sortable[i]) break;
            let {userId,level,xp,xpNeeded} = sortable[i]

            embed.addFields([{
                name: ` `,
                value: `**#${i+1} <@${userId}>**
                    Level: \`${level}\`
                    XP: \`${xp}/${xpNeeded}\``
            }])
        }

        return await i.reply({embeds:[embed]})
    }
}