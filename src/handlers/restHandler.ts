import {ChasBot} from "../typings/ChasBot";
import console from '../util/logger'
import {Routes} from "discord.js";

const {CLIENT_ID} = require('../../config.json')

export function init(c: ChasBot){
    (async () => {
        try {
            await c.restClient.put(
                Routes.applicationCommands(CLIENT_ID),
                {body: c.restCmds}
            )
        } catch (err) {
            console.error('[REST] [GLOBAL]:',err)
        }
    })();
}