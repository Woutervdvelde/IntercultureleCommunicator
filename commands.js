const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { REST } = require('@discordjs/rest');
const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
const { Routes } = require('discord-api-types/v9');

const LocalStorage = require('node-localstorage').LocalStorage;
const Store = new LocalStorage('./scratch');
//Store.setItem(key, value)
//Store.getItem(key)

const { questions, createQuestionMenu } = require('./questions');

const getOptionValue = (options, search) => {
    const response = options.find(o => o.name == search);
    return response ? response.value : null;
}

const removeResponse = (interaction) => {
    try {
        interaction.deferReply();
        interaction.deleteReply();
    } catch (e) { }
}

const ping = async (interaction) => {
    await interaction.reply({ content: 'Pong!', ephemeral: true });
}

const say = async (interaction) => {
    const options = interaction.options._hoistedOptions;
    const message = getOptionValue(options, 'message');

    removeResponse(interaction);
    interaction.channel.send(message);
}

const question = async (interaction) => {
    const q = questions[Math.floor(Math.random() * questions.length)];
    const row = new MessageActionRow()
        .addComponents(createQuestionMenu(q))

    await interaction.reply({ content: q.question, components: [row] });
}

const commands = [
    {
        name: 'ping',
        description: 'Check if the bot is up and running',
        execute: ping
    },
    {
        name: 'say',
        description: 'Says with given message',
        default_member_permissions: 0x0000000000000008,
        execute: say,
        options: [
            {
                name: 'message',
                description: 'message you want the bot to say',
                type: 3,
                required: true
            }
        ]
    },
    {
        name: 'question',
        description: 'Asks you a random question',
        execute: question
    }
];

const registerCommands = async (GUILD_ID) => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, GUILD_ID),
            { body: commands },
        );
    } catch (error) {
        console.error(error);
    }
};

module.exports = { commands, registerCommands }