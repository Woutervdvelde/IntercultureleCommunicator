const { MessageActionRow, MessageSelectMenu, MessageEmbed, User } = require('discord.js');
const { REST, ALLOWED_STICKER_EXTENSIONS } = require('@discordjs/rest');
const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
const { Routes } = require('discord-api-types/v9');

const { questions, createQuestionMenu, createQuestionEmbed } = require('./questions');
const { getNotificationList, setNotificationList, getUserStats } = require('./notificationHandler');

const getOptionValue = (interaction, search) => {
    const options = interaction.options._hoistedOptions;
    const response = options.find(o => o.name == search);
    return response ? response.value : null;
}

const removeResponse = (interaction) => {
    try {
        interaction.deferReply();
        interaction.deleteReply();
    } catch (e) { }
}

const ping = async (interaction) => await interaction.reply({ content: 'Pong!', ephemeral: true });

const say = async (interaction) => {
    const message = getOptionValue(interaction, 'message');

    removeResponse(interaction);
    interaction.channel.send(message);
}

const message = async (interaction, client) => {
    const message = getOptionValue(interaction, 'message');
    const member_id = getOptionValue(interaction, 'user');
    const member = await client.users.fetch(member_id);
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
    const q = questions[Math.floor(Math.random() * questions.length)];
    const row = new MessageActionRow()
        .addComponents(createQuestionMenu(q))
    const embed = createQuestionEmbed(q.question);

    let member;
    if (!interaction instanceof User) {
        if (!interaction.inGuild()) return await interaction.reply("You can only use this feature in a guild");

        const user_id = getOptionValue(interaction, 'user');
        member = await interaction.guild.members.fetch(user_id);
        if (!member) return await interaction.reply({ content: "Couldn't send to that user", ephemeral: true });

        try {
            await interaction.reply({ content: "Okay", ephemeral: true });
        } catch (e) {
            await interaction.reply({ content: "Couldn't send to that user" });
        }
    } else {
        member = interaction;
    }

    await member.send({ embeds: [embed], components: [row] });
}

const notify = async (interaction, client) => {
    const id = interaction.user.id;
    const notifyList = getNotificationList();

    if (notifyList.includes(id))
        notifyList.splice(notifyList.indexOf(id), 1);
    else
        notifyList.push(id);

    const user = await client.users.fetch(id);
    await user.send(
        notifyList.includes(id)
            ? `You will now receive notifications\nThey will be randomly sent between ${process.env.NOTIFICATION_MIN_TIME} minutes and ${process.env.NOTIFICATION_MAX_TIME} minutes`
            : 'You will no longer receive notifications'
    );

    setNotificationList(notifyList);
    removeResponse(interaction);
}

const stats = async (interaction, client) => {
    const id = getOptionValue(interaction, 'user') ?? interaction.user.id;
    const user = await client.users.fetch(id);
    const stats = getUserStats(id);

    const embed = new MessageEmbed()
        .setColor('BLURPLE')
        .setAuthor({ name: user.username, iconURL: user.avatarURL() })
        .addFields(
            { name: 'Answered correctly', value: stats.right.toString(), inline: true },
            { name: 'Answered wrong', value: stats.wrong.toString(), inline: true }
        );

    if (stats.right + stats.wrong == 0)
        embed.setDescription(`No questions have been answered yet`);
    else
        embed.setDescription(`Answered ${Math.round(stats.right / (stats.right + stats.wrong) * 100)}% of the questions correctly`);

    interaction.reply({ embeds: [embed] });
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
        name: 'notify',
        description: 'Toggle notifications',
        execute: notify
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
    },
    {
        name: 'stats',
        description: 'Shows statistics of a specific person (defaults to yourself)',
        execute: stats,
        options: [
            {
                name: 'user',
                description: 'user you want statistics from',
                type: 6,
                required: false
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