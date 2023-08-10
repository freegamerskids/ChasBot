import { ChasBot } from "../../typings/ChasBot";
import { CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, ColorResolvable } from "discord.js";
import { request } from "undici";

let useragent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 RuxitSynthetic/1.0 v18911347667 t7338451470782258495 athfa3c3975 altpub cvcv=2 smf=0'

export default {
    name:'silly',
    description:'so silly',
    options:[],
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver) {
        const commands = require('./sillyConfig.json')
        const commandName = options.getSubcommand()
        const cmd = commands[commandName.toLowerCase()]

        const multi = cmd['multireddits'][Math.floor(Math.random() * cmd['multireddits'].length)]
        let subreddit
        {
            let req = await request(`https://api.reddit.com/api/multi${multi}?raw_json=1`,{headers:{'User-Agent':useragent}})
            let json = await req.body.json()
            const subreddits: {name:string}[] = json.data.subreddits
            subreddit = 'r/' + subreddits[Math.floor(Math.random() * subreddits.length)].name
        }

        let req = await request(`https://api.reddit.com/${subreddit}/random?raw_json=1`, {maxRedirections:1,headers:{'User-Agent':useragent}})
        let json = await req.body.json()
        const post = json[0].data.children[0].data

        const embed_col = post.link_flair_background_color
            ? post.link_flair_background_color
            : (post.author_flair_text_color
                ? post.author_flair_text_color
                : 'Random')

        const embed = new EmbedBuilder()
        .setTitle(post.title)
        .setAuthor({name:`By ${post.author} on ${subreddit}`,url:'https://reddit.com'+post.permalink})
        .setImage(post.is_video ? post.media.reddit_video.fallback_url : post.url.replace('gifv','gif'))
        .setColor(embed_col == 'dark' ? 'DarkButNotBlack' : embed_col as ColorResolvable)

        return await i.reply({ embeds:[embed] })
    }
}