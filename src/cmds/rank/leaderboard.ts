import {CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder} from "discord.js";
import {ChasBot} from "../../typings/ChasBot";

export default {
    name: 'leaderboard',
    description: 'Gets the rank leaderboard',
    options:[],
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver, c: ChasBot){
        let ranks
        try { ranks = await c.GuildDB.getData(`/${i.guildId}/ranks`) }
        catch (e) { return await i.reply({content:'Seems like this server is a ghost town.', ephemeral:true}) }

        let embed = new EmbedBuilder({title: `${i.guild.name}`})
            .setAuthor({name:'Leaderboard'})
            .setColor('Random')
            .setThumbnail(i.guild.iconURL({ extension: 'png', size: 128 }))

        //@ts-ignore
        const sortable: [string,{level:number,xp:number,xp_needed:number}][] = Object.entries(ranks).sort(([,a],[,b]) => (b as any).xp - (a as any).xp)

        for (let i = 0; i < 10; i++) {
            if (!sortable[i]) break;
            let [userid,info] = sortable[i]

            embed.addFields([{
                name: ` `,
                value: `**#${i+1} <@${userid}>**
                    Level: \`${info.level}\`
                    XP: \`${info.xp}/${info.xp_needed}\``
            }])
        }

        return await i.reply({embeds:[embed]})
    }
}