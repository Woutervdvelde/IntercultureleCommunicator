const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const { REST, ALLOWED_STICKER_EXTENSIONS } = require('@discordjs/rest');
const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
const { Routes } = require('discord-api-types/v9');

const LocalStorage = require('node-localstorage').LocalStorage;
const Store = new LocalStorage('./scratch');
//Store.setItem(key, value)
//Store.getItem(key)

const { questions, createQuestionMenu, createQuestionEmbed } = require('./questions');

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

const message = async (interaction) => {
    const options = interaction.options._hoistedOptions;
    const message = getOptionValue(options, 'message');
    const member_id = getOptionValue(options, 'user');
    const member = await interaction.guild.members.fetch(member_id);
    if (!member) return await interaction.reply({ content: "Couldn't send to that user", ephemeral: true });

    try {
        await member.send(message);
        await interaction.reply({ content: "Sent", ephemeral: true });
    } catch (e) {
        await interaction.reply({ content: "Couldn't send to that user", ephemeral: true });
    }
}

const question = async (interaction) => {
    const q = questions[Math.floor(Math.random() * questions.length)];
    const row = new MessageActionRow()
        .addComponents(createQuestionMenu(q))
    const embed = createQuestionEmbed(q.question);

    await interaction.reply({ embeds: [embed], components: [row] });
}

const ask = async (interaction) => {
    if (!interaction.inGuild()) return await interaction.reply("You can only use this feature in a guild");

    const options = interaction.options._hoistedOptions;
    const member_id = getOptionValue(options, 'user');
    const member = await interaction.guild.members.fetch(member_id);
    if (!member) return await interaction.reply({ content: "Couldn't send to that user", ephemeral: true });

    const q = questions[Math.floor(Math.random() * questions.length)];
    const row = new MessageActionRow()
        .addComponents(createQuestionMenu(q))
    const embed = createQuestionEmbed(q.question);

    try {
        await member.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: "Okay", ephemeral: true });
    } catch (e) {
        await interaction.reply({ content: "Couldn't send to that user", ephemeral: true });
    }
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
        name: 'message',
        description: 'Messages specified user the specified text',
        default_member_permissions: 0x0000000000000008,
        execute: message,
        options: [
            {
                name: 'user',
                description: 'the person who you want the message to be send to',
                type: 6,
                required: true
            }, 
            {
                name: 'message',
                description: 'the message you want to send',
                type: 3,
                required: true
            }
        ]
    },
    {
        name: 'question',
        description: 'Asks you a random question',
        execute: question
    },
    {
        name: 'ask',
        description: 'Ask a question to a specific person (DM)',
        execute: ask,
        options: [
            {
                name: 'user',
                description: 'the person who the question will be asked to',
                type: 6,
                required: true
            }
        ]
    }
];

const registerCommands = async () => {
    try {
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );
    } catch (error) {
        console.error(error);
    }
};

module.exports = { commands, registerCommands }