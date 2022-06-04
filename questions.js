const { MessageSelectMenu, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { getUserStats, setUserStats, getNotificationList, setNotificationList } = require('./notificationHandler');
const { getMotivationQuote, getAlmostQuote, getBadQuote } = require('./quotes');

/**
 * @param {Number} percentage value between 0 and (including) 1
 */
const getQuote = (percentage) => {
    if (percentage < 0.5) return getBadQuote();
    if (percentage < 1) return getAlmostQuote();
    return getMotivationQuote();
}

//TODO: make the 'value' in answers increase automatically
const questions = [
    {
        question: 'Bij wie hoort "Machtafstand"?',
        answers: [
            { label: 'Hofstede', correct: true, value: '1' },
            { label: 'Hall', correct: false, value: '2' },
            { label: 'Kluckhohn', correct: false, value: '3' },
            { label: 'Trompenaars en Hampden-Turner', correct: false, value: '4' }
        ]
    },
    {
        question: 'Bij wie hoort "De keten van handelingen"?',
        answers: [
            { label: 'Hofstede', correct: false, value: '1' },
            { label: 'Hall', correct: true, value: '2' },
            { label: 'Kluckhohn', correct: false, value: '3' },
            { label: 'Trompenaars en Hampden-Turner', correct: false, value: '4' }
        ]
    },
    {
        question: 'Bij wie hoort "De natuur van de mens"?',
        answers: [
            { label: 'Hofstede', correct: false, value: '1' },
            { label: 'Hall', correct: false, value: '2' },
            { label: 'Kluckhohn', correct: true, value: '3' },
            { label: 'Trompenaars en Hampden-Turner', correct: false, value: '4' }
        ]
    },
    {
        question: 'Bij wie hoort "Verleden - Heden - Toekomst"?',
        answers: [
            { label: 'Hofstede', correct: false, value: '1' },
            { label: 'Hall', correct: false, value: '2' },
            { label: 'Kluckhohn', correct: true, value: '3' },
            { label: 'Trompenaars en Hampden-Turner', correct: false, value: '4' }
        ]
    },
    {
        question: 'Bij wie hoort "Status (toegeschreven/verworven)"?',
        answers: [
            { label: 'Hofstede', correct: false, value: '1' },
            { label: 'Hall', correct: false, value: '2' },
            { label: 'Kluckhohn', correct: false, value: '3' },
            { label: 'Trompenaars en Hampden-Turner', correct: true, value: '4' }
        ]
    },
    {
        question: 'Welke hoort NIET bij de basiswaarden van Hall?',
        answers: [
            { label: 'Context (laag/hoog)', correct: false, value: '1' },
            { label: 'Tijdsbeleving', correct: false, value: '2' },
            { label: 'Boodschappen (snel/langzaam)', correct: false, value: '3' },
            { label: 'Persoonlijke ruimte', correct: false, value: '4' },
            { label: 'Hedonisme & soberheid', correct: true, value: '5' },
            { label: 'De keten van handelingen', correct: false, value: '6' },
            { label: 'Informatiestroom (snel/langzaam)', correct: false, value: '7' }
        ]
    },
    {
        question: 'Bij wie hoort "Persoonlijke ruimte"?',
        answers: [
            { label: 'Hofstede', correct: false, value: '1' },
            { label: 'Hall', correct: true, value: '2' },
            { label: 'Kluckhohn', correct: false, value: '3' },
            { label: 'Trompenaars en Hampden-Turner', correct: false, value: '4' }
        ]
    },//added from here 04-06-2022
    {
        question: 'Universalisme, wat is belangrijker voor een universalist?',
        answers: [
            { label: 'regels', correct: true, value: '1' },
            { label: 'relaties', correct: false, value: '2' },
        ]
    },
    {
        question: 'Universalisme, wat is belangrijker voor een particularist?',
        answers: [
            { label: 'regels', correct: false, value: '1' },
            { label: 'relaties', correct: true, value: '2' },
        ]
    },
    {
        question: 'Wat is de buitenste laag van de Culturele ui?',
        answers: [
            { label: 'Tastbare zaken', correct: true, value: '1' },
            { label: 'Normen & Waarden', correct: false, value: '2' },
            { label: 'Basiswaarden', correct: false, value: '3' },
        ]
    },
    {
        question: 'Waar is dit een voorbeeld van:\n"Het is niet acceptabel om 10 minuten te laat te komen"',
        answers: [
            { label: 'Tastbare zaken', correct: false, value: '1' },
            { label: 'Normen', correct: true, value: '2' },
            { label: 'Waarden', correct: false, value: '3' },
            { label: 'Basiswaarden', correct: false, value: '4' },
        ]
    },
    {
        question: 'Welke laag is abstract en onzichtbaar van de Culturele ui?',
        answers: [
            { label: 'Tastbare zaken', correct: false, value: '1' },
            { label: 'Normen & Waarden', correct: false, value: '2' },
            { label: 'Basiswaarden', correct: true, value: '3' },
        ]
    },
    {
        question: 'Cultuur is aangeleerd, Hofstede noemt dat programmering\nVia wat gebeurt dit allemaal volgens hem?',
        answers: [
            { label: 'Socialisatie', correct: true, value: '1' },
            { label: 'Televisie', correct: false, value: '2' },
            { label: 'Waarneming', correct: true, value: '3' },
            { label: 'Opvoeding', correct: true, value: '4' },
            { label: 'Lezen in een boek', correct: false, value: '5' },
            { label: 'Normen & Waarden', correct: true, value: '6' },
            { label: 'Propaganda', correct: false, value: '7' },
        ]
    },
    {
        question: 'Waar staat de eerste "O" voor in het TOPOI-model?',
        answers: [
            { label: 'Onderzoeken', correct: false, value: '1' },
            { label: 'Ordening', correct: true, value: '2' },
            { label: 'Onbewust', correct: false, value: '3' },
            { label: 'Opvallen', correct: false, value: '4' },
        ]
    },
    {
        question: 'Waar staat de "T" voor in het TOPOI-model?',
        answers: [
            { label: 'Tijdsbeschouwing', correct: false, value: '1' },
            { label: 'Talent', correct: false, value: '2' },
            { label: 'Taal', correct: true, value: '3' },
            { label: 'Tegengesteld', correct: false, value: '4' },
        ]
    },
    {
        question: 'Waar staat de "P" voor in het TOPOI-model?',
        answers: [
            { label: '', correct: false, value: '1' },
        ]
    },
    {
        question: '',
        answers: [
            { label: '', correct: false, value: '1' },
        ]
    },
    {
        question: '',
        answers: [
            { label: '', correct: false, value: '1' },
        ]
    },
]

const createQuestionMenu = (question) => {
    const menu = new MessageSelectMenu()
        .setCustomId('IC_question')
        .setPlaceholder('select an answer..')
        .setMaxValues(question.answers.length)
        .addOptions(question.answers)
    return menu;
}

const createNextQuestionButton = () => {
    const button = new MessageButton()
        .setCustomId('IC_next_question')
        .setLabel("Give me another!")
        .setStyle('PRIMARY')
    return button;
}

const createQuestionEmbed = (description, percentage = 2) => {
    const embed = new MessageEmbed().setDescription(description);
    if (percentage == 2) embed.setColor('BLURPLE');
    if (percentage == 1) embed.setColor('GREEN');
    if (percentage < 1) embed.setColor('ORANGE');
    if (percentage < .5) embed.setColor('RED');
    return embed;
}

const getQuestionByName = (name) => questions.find(q => q.question == name);
const getAnswerFromQuestion = (question, value) => question.answers.find(a => a.value == value);
const getCorrectAnswersFromQuestion = (question) => question.answers.filter(a => a.correct);
const getAnswerPercentage = (question, answers) => {
    let percentage = 1;
    const deduct_points = percentage / question.answers.length;

    question.answers.forEach(answer => {
        if (answers.includes(answer.value)) {
            if (!answer.correct)
                percentage = - deduct_points;
        } else {
            if (answer.correct)
                percentage = - deduct_points;
        }
    });
    return percentage;
}

const parseQuestion = async (interaction) => {
    const user_id = interaction.user.id;
    const content = interaction.message.embeds[0].description;
    const question = getQuestionByName(content);
    if (!question) return;

    const correct = getCorrectAnswersFromQuestion(question);
    const given_answers = interaction.values.map(v => getAnswerFromQuestion(question, v).label + '\n');
    const percentage = getAnswerPercentage(question, interaction.values);

    const stats = getUserStats(user_id);
    percentage == 1 ? stats.right++ : stats.wrong++;
    setUserStats(user_id, stats);

    const correct_text = correct.map(v => v.label + '\n').join('');

    await interaction.update({
        embeds: [createQuestionEmbed(
            `${question.question}\nYour answer: ${given_answers.join('')}Correct answer${correct.length > 1 ? 's' : ''}: ${correct_text}\n${getQuote(percentage)}`,
            percentage)],
        components: [new MessageActionRow().addComponents(createNextQuestionButton())]
    });
}

module.exports = { questions, parseQuestion, createQuestionMenu, createQuestionEmbed }