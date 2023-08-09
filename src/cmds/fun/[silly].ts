import { ChasBot } from "../../typings/ChasBot";
import { CommandInteraction, CommandInteractionOptionResolver, EmbedBuilder, ColorResolvable } from "discord.js";
import { request } from "undici";

export default {
    name:'silly',
    description:'so silly',
    options:[],
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver, c: ChasBot) {
        const commands = require('./sillyConfig.json')
        const commandName = options.getSubcommand()
        const cmd = commands[commandName.toLowerCase()]

        const multi = cmd['multireddits'][Math.floor(Math.random() * cmd['multireddits'].length)]
        let subreddit:string
        {
            let req = await request('https://api.reddit.com/api/multi'+multi)
            let json = await req.body.json()
            const subreddits: {name:string}[] = json.data.subreddits
            subreddit = 'r/' + subreddits[Math.floor(Math.random() * subreddits.length)].name
        }
        
        let post:{author:string,title:string,media:string,link:string,embed_color:string}
        {
            let req = await request(`https://api.reddit.com/${subreddit}/random`, {maxRedirections:1})
            let json = await req.body.json()
            const api_post = json[0].data.children[0].data

            post = {
                author: api_post.author,
                title: api_post.title,
                media: api_post.media ? api_post.media.reddit_video.fallback_url : api_post.url,
                link: 'https://reddit.com'+api_post.permalink,
                embed_color: api_post.link_flair_background_color
            }
        }

        const embed = new EmbedBuilder()
        .setTitle(post.title)
        .setAuthor({name:`By ${post.author} on ${subreddit}`,url:post.link})
        .setImage(post.media)
        .setColor(post.embed_color as ColorResolvable)

        return await i.reply({ embeds:[embed] })
    }
}