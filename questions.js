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

const questions = [
    {
        question: 'Bij wie hoort "Machtafstand"?',
        answers: [
            { label: 'Hofstede', correct: true },
            { label: 'Hall', correct: false },
            { label: 'Kluckhohn', correct: false },
            { label: 'Trompenaars en Hampden-Turner', correct: false }
        ]
    },
    {
        question: 'Bij wie hoort "De keten van handelingen"?',
        answers: [
            { label: 'Hofstede', correct: false },
            { label: 'Hall', correct: true },
            { label: 'Kluckhohn', correct: false },
            { label: 'Trompenaars en Hampden-Turner', correct: false }
        ]
    },
    {
        question: 'Bij wie hoort "De natuur van de mens"?',
        answers: [
            { label: 'Hofstede', correct: false },
            { label: 'Hall', correct: false },
            { label: 'Kluckhohn', correct: true },
            { label: 'Trompenaars en Hampden-Turner', correct: false }
        ]
    },
    {
        question: 'Bij wie hoort "Verleden - Heden - Toekomst"?',
        answers: [
            { label: 'Hofstede', correct: false },
            { label: 'Hall', correct: false },
            { label: 'Kluckhohn', correct: true },
            { label: 'Trompenaars en Hampden-Turner', correct: false }
        ]
    },
    {
        question: 'Bij wie hoort "Status (toegeschreven/verworven)"?',
        answers: [
            { label: 'Hofstede', correct: false },
            { label: 'Hall', correct: false },
            { label: 'Kluckhohn', correct: false },
            { label: 'Trompenaars en Hampden-Turner', correct: true }
        ]
    },
    {
        question: 'Welke hoort NIET bij de basiswaarden van Hall?',
        answers: [
            { label: 'Context (laag/hoog)', correct: false },
            { label: 'Tijdsbeleving', correct: false },
            { label: 'Boodschappen (snel/langzaam)', correct: false },
            { label: 'Persoonlijke ruimte', correct: false },
            { label: 'Hedonisme & soberheid', correct: true },
            { label: 'De keten van handelingen', correct: false },
            { label: 'Informatiestroom (snel/langzaam)', correct: false }
        ]
    },
    {
        question: 'Bij wie hoort "Persoonlijke ruimte"?',
        answers: [
            { label: 'Hofstede', correct: false },
            { label: 'Hall', correct: true },
            { label: 'Kluckhohn', correct: false },
            { label: 'Trompenaars en Hampden-Turner', correct: false }
        ]
    },//added from here 04-06-2022
    {
        question: 'Universalisme, wat is belangrijker voor een universalist?',
        answers: [
            { label: 'regels', correct: true },
            { label: 'relaties', correct: false },
        ]
    },
    {
        question: 'Universalisme, wat is belangrijker voor een particularist?',
        answers: [
            { label: 'regels', correct: false },
            { label: 'relaties', correct: true },
        ]
    },
    {
        question: 'Wat is de buitenste laag van de Culturele ui?',
        answers: [
            { label: 'Tastbare zaken', correct: true },
            { label: 'Normen & Waarden', correct: false },
            { label: 'Basiswaarden', correct: false },
        ]
    },
    {
        question: 'Waar is dit een voorbeeld van:\n"Het is niet acceptabel om 10 minuten te laat te komen"',
        answers: [
            { label: 'Tastbare zaken', correct: false },
            { label: 'Normen', correct: true },
            { label: 'Waarden', correct: false },
            { label: 'Basiswaarden', correct: false },
        ]
    },
    {
        question: 'Welke laag is abstract en onzichtbaar van de Culturele ui?',
        answers: [
            { label: 'Tastbare zaken', correct: false },
            { label: 'Normen & Waarden', correct: false },
            { label: 'Basiswaarden', correct: true },
        ]
    },
    {
        question: 'Cultuur is aangeleerd, Hofstede noemt dat programmering\nVia wat gebeurt dit allemaal volgens hem?',
        answers: [
            { label: 'Socialisatie', correct: true },
            { label: 'Televisie', correct: false },
            { label: 'Waarneming', correct: true },
            { label: 'Opvoeding', correct: true },
            { label: 'Lezen in een boek', correct: false },
            { label: 'Normen & Waarden', correct: true },
            { label: 'Propaganda', correct: false },
        ]
    },
    {
        question: 'Waar staat de eerste "O" voor in het TOPOI-model?',
        answers: [
            { label: 'Onderzoeken', correct: false },
            { label: 'Ordening', correct: true },
            { label: 'Onbewust', correct: false },
            { label: 'Opvallen', correct: false },
        ]
    },
    {
        question: 'Waar staat de "T" voor in het TOPOI-model?',
        answers: [
            { label: 'Tijdsbeschouwing', correct: false },
            { label: 'Talent', correct: false },
            { label: 'Taal', correct: true },
            { label: 'Tegengesteld', correct: false },
        ]
    },
    {
        question: 'Waar staat de "P" voor in het TOPOI-model?',
        answers: [
            { label: 'Personen', correct: true },
            { label: 'Prestatie', correct: false },
            { label: 'Pitchen', correct: false },
            { label: 'Plannen', correct: false },
        ]
    },
    {
        question: 'Waar staat de "I" voor in het TOPOI-model?',
        answers: [
            { label: 'Inzet', correct: true },
            { label: 'Inzicht', correct: false },
            { label: 'Inlevingsvermogen', correct: false },
            { label: 'Indirect', correct: false },
        ]
    },
    {
        question: 'Bij wie hoort "Laag- en hoogcontextcommunicatie"?',
        answers: [
            { label: 'Hofstede', correct: false },
            { label: 'Hall', correct: true },
            { label: 'Kluckhohn', correct: false },
            { label: 'Trompenaars en Hampden-Turner', correct: false }
        ]
    },
    {
        question: 'In welke cultuur begin je bij de context en werk je naar de kern toe?',
        answers: [
            { label: 'Laag context cultuur', correct: false },
            { label: 'Hoog context cultuur', correct: true },
        ]
    },
    {
        question: 'Bij wie hoort "Monochrone en Polychrone tijdsbeleving"?',
        answers: [
            { label: 'Hofstede', correct: false },
            { label: 'Hall', correct: true },
            { label: 'Kluckhohn', correct: false },
            { label: 'Trompenaars en Hampden-Turner', correct: false }
        ]
    },
    {
        question: 'Wat hoort er bij een Monochrone tijdsbeleving?',
        answers: [
            { label: 'Het liefst één ding tegelijk', correct: true },
            { label: 'Werkt snel en stipt', correct: true },
            { label: 'Vaak relatiegericht', correct: false },
            { label: 'Behoefte aan expliciete informatie', correct: true },
            { label: 'Tijd is ruimtelijk', correct: false },
            { label: 'Communiceert vanuit hoogcontextcultuur', correct: false }
        ]
    },
    {
        question: 'Hoe noemt Hall het afbakenen van tijd in blokjes?',
        answers: [
            { label: 'Opdelen', correct: false },
            { label: 'Breken', correct: false },
            { label: 'Onderverdelen', correct: false },
            { label: 'Compartimentaliseren', correct: true },
        ]
    },
    {
        question: 'Bij wie hoort "Persoonlijke ruimte"?',
        answers: [
            { label: 'Hofstede', correct: false },
            { label: 'Hall', correct: true },
            { label: 'Kluckhohn', correct: false },
            { label: 'Trompenaars en Hampden-Turner', correct: false }
        ]
    },
    {
        question: 'Als je een grote persoonlijke ruimte hebt, dan hou je van mensen die...?',
        answers: [
            { label: 'Heel dichtbij staan', correct: false },
            { label: 'Niet heel dichtbij staan', correct: true },
        ]
    },
    {
        question: 'Bij wie hoort "Snelle en langzame boodschappen"?',
        answers: [
            { label: 'Hofstede', correct: false },
            { label: 'Hall', correct: true },
            { label: 'Kluckhohn', correct: false },
            { label: 'Trompenaars en Hampden-Turner', correct: false }
        ]
    },
    {
        question: 'Wat zijn voorbeelden van snelle boodschappen?',
        answers: [
            { label: 'Tweet', correct: true },
            { label: 'Kunst', correct: false },
            { label: 'SMS', correct: true },
            { label: 'Boeken', correct: false },
        ]
    },
    {
        question: 'Bij wie hoort "Snelle en langzame informatiestroom"?',
        answers: [
            { label: 'Hofstede', correct: false },
            { label: 'Hall', correct: true },
            { label: 'Kluckhohn', correct: false },
            { label: 'Trompenaars en Hampden-Turner', correct: false }
        ]
    },
    {
        question: 'Je hebt een nieuwe klant binnen gehaald!\n Tijdens de koffie vertel je dit aan je collega\'s, het nieuws blijft wel binnen de afdeling.\nDit is een voorbeeld van?',
        answers: [
            { label: 'Langzame informatiestroom', correct: true },
            { label: 'Snelle informatiestroom', correct: false },
        ]
    },
    // {
    //     question: '',
    //     answers: [
    //         { label: '', correct: false },
    //     ]
    // },
].map(q => { q.answers = q.answers.map((a, i) => { a.value = i.toString(); return a }); return q })

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