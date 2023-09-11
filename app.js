

require('dotenv').config();

const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
const axios = require("axios")

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply('Welcome! Send a location to find out what the temperature is there now!'))

// Custom methods
bot.on("message", async (ctx) => {
    if (ctx.message.location) {
        const loc = ctx.message.location

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${loc.latitude}&lon=${loc.longitude}&appid=${process.env.OPEN_WEATHER_API_KEY}`;
        const response = await axios.get(url); 

        const celsius = (Number(response.data.main.temp) - 273.15).toFixed(1);

        ctx.reply(`${response.data.name}: ${celsius} C`)
    } else {
        ctx.reply("Bot needs a location!")
    }
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
