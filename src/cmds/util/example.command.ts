import {CommandInteraction,CommandInteractionOptionResolver} from "discord.js";
import {ChasBot} from "../../typings/ChasBot";

export default {
    name: 'example', // the command name
    description: 'Example description', // description example
    options:[], // too long to explain, https://discord.com/developers/docs/interactions/application-commands#slash-commands
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver, c: ChasBot){
        // code goes here
    }
}