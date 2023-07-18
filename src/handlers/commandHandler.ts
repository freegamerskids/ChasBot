import {ChasBot} from "../typings/ChasBot";
import console from "../util/logger"
import {CommandInteraction, Interaction, Message} from "discord.js";
import {readdirSync,lstatSync} from 'node:fs'

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
        const cmdFiles = readdirSync(__dirname+'/../cmds/'+dir)
        for (const file of cmdFiles){
            if (lstatSync(__dirname+`/../cmds/${dir}/${file}`).isDirectory()) {
                const subCmdFiles = readdirSync(__dirname+`/../cmds/${dir}/${file}`)

                // @ts-ignore
                if (!c.mainCmds[dir]) c.mainCmds[dir] = []

                // @ts-ignore
                c.mainCmds[dir].push({
                    name: file,
                    description: file,
                    options: [],
                    type: 2
                })

                for (const sub of subCmdFiles) {
                    const cmd = require(`../cmds/${dir}/${file}/${sub}`)

                    // @ts-ignore
                    c.mainCmds[dir][c.mainCmds[dir].length - 1].options.push({
                        name: cmd.default.name,
                        description: cmd.default.description,
                        options: cmd.default.options,
                        type: 1,
                        run: cmd.default.run
                    })
                }

                continue
            }

            if (!file.endsWith('.ts')) continue;

            const cmd = require(`../cmds/${dir}/${file}`)

            if (file.startsWith(`${dir}_index`)) {
                //@ts-ignore
                c.mainCmds[dir] = {
                    name: cmd.default.name,
                    description: cmd.default.description,
                    options: cmd.default.options,
                    run: cmd.default.run
                }

                continue
            }

            // @ts-ignore
            if (!c.mainCmds[dir]) c.mainCmds[dir] = []

            if (file.startsWith('[')) { // multiple commands in one file (ex. action commands)
                let cmdConfig = require(`../cmds/${dir}/${
                    file.replace('[','').replace(']','').split('.')[0]}Config.json`) // ex. [action].ts => actionConfig.json

                for (let command in cmdConfig) {
                    //@ts-ignore
                    c.mainCmds[dir].push({
                        name: command,
                        description: (cmdConfig[command].description) ? cmdConfig[command].description : cmd.default.description,
                        options: cmd.default.options,
                        type: 1,
                        run: cmd.default.run
                    })
                }

                continue
            }

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
            options     : (!c.mainCmds[mainCmd].hasOwnProperty('run')) ? getSubArrayWithoutFunction(c.mainCmds[mainCmd]) : c.mainCmds[mainCmd].options
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
            i.replied
                ? await i.editReply({content:'Sorry, my head wasn\'t able to process that command. Please try again later.'})
                : await i.reply({content:'Sorry, my head wasn\'t able to process that command. Please try again later.', ephemeral:true})
        }
    })
}