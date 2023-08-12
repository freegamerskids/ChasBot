import {ChasBot} from "../typings/ChasBot";
import console from '../util/logger'
import {Uptime} from "../cmds/util/uptime";
import {registerFont} from "canvas";

import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

const {presence} = require('../../config.json')

export function init(c: ChasBot){
    c.once('ready', async () => {
        console.log(`Logged in as ${c.user?.tag}!`)
        console.verbose(`I'm in ${c.guilds.cache.size} guilds!`)

        c.user?.setPresence({
            status: presence.status,
            activities: [{
                name: presence.activity.name,
                type: presence.activity.type,
                url : presence.activity.url
            }]
        })

        new Uptime()
    })

    registerFont(__dirname+'/../../TakeCoffee.ttf',{family: 'take-coffee'})

    //@ts-ignore -- loading it here since its a long list
    c.timezones = Intl.supportedValuesOf('timeZone')
    dayjs.extend(utc)
    dayjs.extend(tz)
}