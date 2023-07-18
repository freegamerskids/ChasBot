import {Canvas, createCanvas, Image, loadImage} from "canvas";
import {AttachmentBuilder, GuildMember} from "discord.js";
import {request} from "undici";
import console from "./logger";

function getImageResolution(image:Image) {
    return {x: image.width, y: image.height}
}

function applyText(canvas:Canvas, text:string, fontSize = 70) {
    const context = canvas.getContext('2d');

    do {
        context.font = `${fontSize}px take-coffee`;
        fontSize -= 2
    } while (context.measureText(text).width > canvas.width - 150);

    return context.font;
}

export async function createGreetingBanner(member:GuildMember,background_url:string,text:string) {
    const bg = await loadImage(background_url)
    let bg_res = getImageResolution(bg)

    const canvas = createCanvas(bg_res.x,bg_res.y)
    const context = canvas.getContext('2d')

    // background
    context.drawImage(bg,0,0)

    // opacity rectangle
    context.fillStyle = "rgba(0,0,0,0.6)"
    context.fillRect(0,0,canvas.width,canvas.height)

    //text
    context.textAlign = "center"
    context.fillStyle = '#ffffff'

    context.font = applyText(canvas,`${member.displayName}`,250)
    context.fillText(`${member.displayName}`, Math.round(canvas.width/2),Math.round(canvas.width/6))

    context.font = applyText(canvas,`${text}`,250)
    context.fillText(text, Math.round(canvas.width/2),Math.round(canvas.width/1.6))

    // profile pic
    const avatar = await loadImage(member.displayAvatarURL({ extension:'jpg' }))

    context.beginPath()
    context.arc(Math.round(canvas.width/2),Math.round(canvas.height/2),500,0,Math.PI * 2,true)
    context.clip()
    context.drawImage(avatar,Math.round(canvas.width/2)-500,Math.round(canvas.height/2)-500,1000,1000)
    context.closePath()

    return (new AttachmentBuilder(canvas.createJPEGStream(), {name: `greetings-${member.displayName}.png`}))
}