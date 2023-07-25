import {ChasBot} from "../typings/ChasBot";
import {handleUser} from "../util/rankHandler";
import {TextChannel} from "discord.js";

export function init(c:ChasBot){
    c.on('messageCreate', async (m) =>{
        if (!m.inGuild()) return;
        if (m.author.bot) return;
        if (!c.rankCooldowns[m.guildId]) c.rankCooldowns[m.guildId] = []
        if (!c.rankCooldowns[m.guildId][m.author.id]) c.rankCooldowns[m.guildId][m.author.id] = 0
        // @ts-ignore
        if (c.rankCooldowns[m.guildId][m.author.id] > Date.now()) return;

        c.rankCooldowns[m.guildId][m.author.id] = Date.now() + 5_000 // 5 seconds

        let [rankup, user_rank] = await handleUser(c,m.guildId,m.author.id)

        if (rankup) {
            try {
                let rankup_channel = await c.GuildDB.getData(`/${m.guildId}/channels/rankup`);
                await (await m.guild.channels.fetch(rankup_channel) as TextChannel).send({content:`GG! <@${m.author.id}> just ranked up to level ${user_rank.level}`})
            } catch (e) {
                await m.reply({content:`GG! <@${m.author.id}> just ranked up to level ${user_rank.level}`})
            }

            try {
                let role = await c.GuildDB.getData(`/${m.guildId}/rank_rewards/${user_rank.level}`)
                await m.member.roles.add(role,'Rankup reward')
            }
            catch (e) {}
        }
    })
}