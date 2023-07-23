import {ChasBot} from "../typings/ChasBot";
import {reloadGuildCommands} from "../util/reloadGuildCommands";

export function init(c: ChasBot){
    (async () => {
        let db = await c.GuildDB.getData('/')
        for (const guild in db) {
            if (!db[guild]['custom_commands']) continue;
            if (guild == 'timezones') continue;

            await reloadGuildCommands(c,guild)
        }
    })();
}