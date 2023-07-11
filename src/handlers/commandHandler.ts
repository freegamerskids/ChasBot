import {ChasBot} from "../typings/ChasBot";
import console from "../util/logger"
import {CommandInteraction, Interaction} from "discord.js";
import {readdirSync} from 'node:fs'

function findSubCommand(options:[{type:number}]) {
    for (const option of options){
        if (option.type == 1) return 2
    }
    return 1
}

function getSubArrayWithoutFunction(options:[{name:string,description:string,options:[{}],type:number}]){
    let a = []
    for (const option of options) {
        a.push({
            name: option.name,
            description: option.description,
            options: option.options,
            type: option.type
        })
    }
    return a
}

export function init(c: ChasBot) {
    for (const dir of c.mainCmdDirectories){
        const cmdFiles = readdirSync(__dirname+'/../cmds/'+dir).filter(file => file.endsWith('.ts'))
        for (const file of cmdFiles){
            const cmd = require(`../cmds/${dir}/${file}`)

            // @ts-ignore
            if (!c.mainCmds[dir]) c.mainCmds[dir] = []

            // @ts-ignore
            c.mainCmds[dir].push({
                name: cmd.default.name,
                description: cmd.default.description,
                options: cmd.default.options,
                type: findSubCommand(cmd.default.options),
                run: cmd.default.run
            })
        }
    }

    for (let mainCmd in c.mainCmds) {
        c.cmds.set(mainCmd,{
            name        : mainCmd,
            description : mainCmd,
            // @ts-ignore temporary
            options     : c.mainCmds[mainCmd]
        })
        c.restCmds.push({
            name        : mainCmd,
            description : mainCmd,
            // @ts-ignore temporary
            options     : getSubArrayWithoutFunction(c.mainCmds[mainCmd])
        })
    }

    // @ts-ignore
    c.on('interactionCreate', async (i:Interaction) => {
        if (!i.isCommand()) return;
        if (!i.inGuild()) return await (i as CommandInteraction).reply({content:`I can't operate under the immense pressure of Discord DMs.`,ephemeral:true});

        const {commandName, options} = i

        if (!c.cmds.has(commandName)) return i.reply({content:`I... don't understand the command quite well...`,ephemeral:true});

        try {
            //@ts-ignore
            (options.getSubcommandGroup() != null) // @ts-ignore
                ? await (c.cmds.get(commandName))?.options.filter(o => o.name == options.getSubcommandGroup())[0].options.filter(o => o.name == options.getSubcommand())[0].run(i,options,c) //@ts-ignore
                : await (c.cmds.get(commandName))?.options.filter(o => o.name == options.getSubcommand())[0].run(i,options,c)
        } catch (err) {
            console.warn(err)
            i.reply({content:'Sorry, my head wasn\'t able to process that command. Please try again later.', ephemeral:true})
        }
    })
}