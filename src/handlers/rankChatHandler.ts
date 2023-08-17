import {ChasBot} from "../typings/ChasBot";
import {handleUser} from "../util/rankHandler";
import {TextChannel} from "discord.js";
import {HydratedDocument, Types} from "mongoose";
import {IGuild, IUserRank, MGuild} from "../models/guild";

export function init(c:ChasBot){
    c.on('messageCreate', async (m) =>{
        if (!m.inGuild()) return;
        if (m.author.bot) return;
        if (!c.rankCooldowns[m.guildId]) c.rankCooldowns[m.guildId] = []
        if (!c.rankCooldowns[m.guildId][m.author.id]) c.rankCooldowns[m.guildId][m.author.id] = 0
        // @ts-ignore
        if (c.rankCooldowns[m.guildId][m.author.id] > Date.now()) return;

        c.rankCooldowns[m.guildId][m.author.id] = Date.now() + 5_000 // 5 seconds

        let handle = await handleUser(c,m.guildId,m.author.id)
        let rankup:boolean = handle[0] as boolean
        let user_rank:(Types.Subdocument<Types.ObjectId> & IUserRank) = handle[1] as any

        if (rankup) {
            const guild:HydratedDocument<IGuild> = await MGuild.findByGuildId(m.guildId)

            try {
                let rankup_channel = guild.channels.rankup
                await (await m.guild.channels.fetch(rankup_channel) as TextChannel).send({content:`GG! <@${m.author.id}> just ranked up to level ${user_rank.level}`})
            } catch (e) {
                await m.reply({content:`GG! <@${m.author.id}> just ranked up to level ${user_rank.level}`})
            }

            try {
                let role = guild.rankRewards.find(r => r.level == user_rank.level)
                await m.member.roles.add(role.roleId,'Rankup reward')
            }
            catch (e) {}
        }
    })
}