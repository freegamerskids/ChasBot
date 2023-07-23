import {ChasBot} from "../typings/ChasBot";
import {Routes} from "discord.js";
import console from "./logger";

const {CLIENT_ID} = require('../../config.json')

export async function reloadGuildCommands(c:ChasBot, guildId:string) {
    let guild = await c.GuildDB.getData(`/${guildId}`)

    let cmds = []
    let fun_cmds = {name: 'fun',description:'fun',options:[]}

    if (guild['custom_commands']['action']){
        const actionCommands = guild['custom_commands']['action']
        for (const action in actionCommands) {
            const cmd = actionCommands[action]
            fun_cmds.options.push({
                name: action,
                description: cmd.description,
                options: c.mainCmds['fun'][0]['options'],
                type: 1,
                run: c.mainCmds['fun'][0]['run']
            })
        }
    }

    cmds.push(fun_cmds)
    let fcmds = c.cmds.get('fun')
    fcmds.options.push(...fun_cmds.options)
    c.cmds.set('fun',fcmds)
    try {
        await c.restClient.put(
            Routes.applicationGuildCommands(CLIENT_ID,guildId),
            {body: cmds}
        )
    } catch (err) {
        console.error('[REST] [GUILD]:',err)
    }
}