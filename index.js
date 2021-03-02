const Discord = require('discord.js');

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', message => {
    console.log(message.content);
});

client.login(process.env['DISCORD_TOKEN']).catch(console.error);