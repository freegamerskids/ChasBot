import {CommandInteraction, CommandInteractionOptionResolver, GuildMember} from "discord.js";
import {ChasBot} from "../../../typings/ChasBot";
import {xpNeedCalcFunction} from "../../../util/rankHandler";
import {request} from "undici";
import {IGuild, MGuild} from "../../../models/guild";
import {HydratedDocument} from "mongoose";

export default {
    name: 'importranks',
    description: 'Imports ranks from other bots (WARNING: this command will wipe every rank currently in this bot.)',
    options:[
        {
            name: 'bot',
            description: "the bot you want to import the ranks from",
            type: 3,
            required: true,
            choices:[
                {
                    name:'AmariBot',
                    value:'amari'
                }
            ]
        }
    ],
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver, c: ChasBot){
        if (!(i.member as GuildMember).permissions.has('Administrator') || !(i.guild.ownerId == (i.member as GuildMember).id)) return await i.reply({ content:'You shall not pass!', ephemeral:true })

        await i.deferReply()

        let guild:HydratedDocument<IGuild> = await MGuild.findByGuildId(i.guildId)

        if (guild.importedRanks) return await i.editReply({content:`Ranks have already been imported from ${guild.importedRanks}`})

        const bot = options.getString('bot',true).toLowerCase()

        switch (bot) {
            case 'amari':
                let api = 'https://amaribot.com/guild/leaderboard/'+i.guildId

                let main_req = await request(api)
                if (main_req.statusCode == 404) return await i.editReply({content:'Cannot find this guild.'})

                let json = await main_req.body.json()
                let page_count = Math.ceil(json.total_count / json.count)

                let full_list: {level:number,exp:string,id:string}[] = []
                full_list.push(...json.data)

                for (let index = 2; index <= page_count; index++){
                    let req = await request(api+'?page='+index)
                    let json = await req.body.json()

                    full_list.push(...json.data)
                }

                for (const rank of full_list){
                    let real_rank = rank.level
                    let num_exp = Number(rank.exp.replace(',',''))
                    while (num_exp < xpNeedCalcFunction(real_rank-1)) { real_rank -= 1 }

                    let r = guild.ranks.find(r => r.userId == rank.id)
                    if (r) {
                        r.level = real_rank
                        r.xp = num_exp
                        r.xpNeeded = xpNeedCalcFunction(real_rank+1)

                        continue
                    }

                    guild.ranks.push({userId:rank.id,level:real_rank,xp:num_exp,xpNeeded:xpNeedCalcFunction(real_rank+1)})
                }

                guild.importedRanks = 'AmariBot'

                break
            default:
                return await i.editReply({content:'Cannot get data from this bot.'})
        }

        await guild.save()

        return await i.editReply({content:`Successfully imported ranks from ${guild.importedRanks}.`})
    }
}