require('dotenv').config();

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const { commands, registerCommands } = require('./commands')
const { parseQuestion } = require('./questions');

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const guilds = await client.guilds.fetch();
    guilds.forEach(guild => registerCommands(guild.id));
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = commands.find(c => c.name === interaction.commandName);
    if (!command) return await interaction.reply('command not found..');

    command.execute(interaction);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isSelectMenu()) return;
    parseQuestion(interaction);
});

client.login(process.env.BOT_TOKEN);