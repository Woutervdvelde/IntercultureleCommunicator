require('dotenv').config();

const { Client, Intents, StoreChannel } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const { commands, registerCommands } = require('./commands')
const { parseQuestion } = require('./questions');

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    registerCommands();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = commands.find(c => c.name === interaction.commandName);
    if (!command) return await interaction.reply('command not found..');

    command.execute(interaction, client);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isSelectMenu()) return;
    parseQuestion(interaction, client);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId != 'IC_next_question') return;
    const command = commands.find(c => c.name == 'question');
    command.execute(interaction, client);

    //TODO: remove button but gives error (INTERACTION_ALREADY_REPLIED)
    // await interaction.update({components:[]})
});

client.login(process.env.BOT_TOKEN);