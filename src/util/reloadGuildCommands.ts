import {ChasBot} from "../typings/ChasBot";
import {Routes} from "discord.js";
import console from "./logger";
import {MGuild} from "../models/guild";

const {CLIENT_ID} = require('../../config.json')

export async function reloadGuildCommands(c:ChasBot, guildId:string) {
    let guild = await MGuild.findByGuildId(guildId)

    let cmds = []
    let fun_cmds = {name: 'fun',description:'fun',options:[]}

    if (guild['customCommands']['action']){
        const actionCommands = guild['customCommands']['action']
        for (const action of actionCommands) {
            fun_cmds.options.push({
                name: action.name,
                description: action.description,
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