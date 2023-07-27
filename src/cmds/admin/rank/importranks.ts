import {CommandInteraction, CommandInteractionOptionResolver, GuildMember} from "discord.js";
import {ChasBot} from "../../../typings/ChasBot";
import {xpNeedCalcFunction} from "../../../util/rankHandler";
import {request} from "undici";

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

        try {
            let imported_ranks_from = await c.GuildDB.getData(`/${i.guildId}/imported_ranks`)
            return await i.editReply({content:`Ranks has already been imported from ${imported_ranks_from}`})
        } catch (e) {}

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

                    const t = {
                        level: real_rank,
                        xp: num_exp,
                        xp_needed: xpNeedCalcFunction(real_rank+1)
                    }

                    await c.GuildDB.push(`/${i.guildId}/ranks/${rank.id}`,t)
                }

                await c.GuildDB.push(`/${i.guildId}/imported_ranks`,"AmariBot")

                return await i.editReply({content:'Successfully imported ranks from AmariBot.'})
            default:
                return await i.editReply({content:'Cannot get data from this bot.'})
        }
    }
}