export class Uptime {
    static uptimeSeconds: number = 0;

    constructor() {
        setInterval(() => {
            Uptime.uptimeSeconds += 1;
        },1000)
    }

    static get hmsString(): string {
        return `The bot has been up for ${Math.floor(Uptime.uptimeSeconds / 60 / 60 / 24)} day(s), ${Math.floor(Uptime.uptimeSeconds / 60 / 60) - (24 * Math.floor(Uptime.uptimeSeconds / 60 / 60 / 24))} hour(s), ${Math.floor((Uptime.uptimeSeconds / 60) - (60 * Math.floor(Uptime.uptimeSeconds / 60 / 60)))} minute(s) and ${Math.floor(Uptime.uptimeSeconds - (60 * Math.floor(Uptime.uptimeSeconds / 60)))} second(s)`
    }
}