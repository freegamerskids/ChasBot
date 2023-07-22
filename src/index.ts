import {Client, REST, GatewayIntentBits, Collection} from "discord.js";
import {readdirSync, lstatSync} from 'fs'
import {AbortController} from 'node-abort-controller'
import {JsonDB, Config} from "node-json-db";

const {token} = require('../config.json')

class ChasBot extends Client {
    public cmds = new Collection()
    public mainCmdDirectories = readdirSync(__dirname+'/cmds').filter(file => lstatSync(__dirname+'/cmds/'+file).isDirectory() && !file.includes('util'))
    private mainCmds = {}

    private handlerFiles = readdirSync(__dirname+'/handlers').filter(file => file.endsWith('.ts'))

    public restCmds = []
    public restClient = new REST({version: '10'}).setToken(token)

    public GuildDB = new JsonDB(new Config('db.json',true,false,'/',true))

    public timezones: string[] = []

    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
        });

        // @ts-ignore
        global.AbortController = AbortController

        for (const file of this.handlerFiles) {
            const handler = require(`./handlers/${file}`)

            handler.init(this)
        }

        this.login(token)
    }
}

new ChasBot()