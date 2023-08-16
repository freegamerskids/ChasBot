import {ChasBot} from "../typings/ChasBot";
import {reloadGuildCommands} from "../util/reloadGuildCommands";
import {MGuild} from "../models/guild";

export function init(c: ChasBot){
    (async () => {
        for await (const guild of MGuild.where('customCommands')) {
            //if (guild.customCommands.action.length <= 0) return
            await reloadGuildCommands(c,guild.id)
        }
    })();
}