const { MessageSelectMenu, MessageActionRow } = require('discord.js');
const { getMotivationQuote, getAlmostQuote, getBadQuote } = require('./quotes');

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
        question: 'Waar staat \'PBITCH\' voor?',
        answers: [
            { label: 'Personen-Berichten-Informatiestroom-Tijdsbeschouwing-Context-Handeling', correct: false, value: '1' },
            { label: 'Personen-Berichten-Informatiestroom-Tijdsbeschouwing-Context-Handeling', correct: false, value: '2' },
            { label: 'Personen-Berichten-Informatiestroom-Tijdsbeschouwing-Context-Handeling', correct: false, value: '3' },
            { label: 'Personen-Berichten-Informatiestroom-Tijdsbeschouwing-Context-Handeling', correct: false, value: '4' }
        ]
    }
]

const createQuestionMenu = (question) => {
    const menu = new MessageSelectMenu()
        .setCustomId('IC_question')
        .setPlaceholder('select an answer..')
        .setMaxValues(question.answers.length)
        .addOptions(question.answers)
    return menu;
}

const getQuestionByName = (name) => questions.filter(q => q.question == name)[0];
const getAnswerFromQuestion = (question, value) => question.answers.filter(a => a.value == value)[0];
const getCorrectAnswersFromQuestion = (question) => question.answers.filter(a => a.correct);

/**
 * @param {Number} percentage value between 0 and (including) 1
 */
const getQuote = (percentage) => {
    if (percentage < 0.5) return getBadQuote();
    if (percentage < 1) return getAlmostQuote();
    return getMotivationQuote();
}

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
    const question = getQuestionByName(interaction.message.content);
    const correct = getCorrectAnswersFromQuestion(question);
    const given_answers = interaction.values.map(v => getAnswerFromQuestion(question, v).label + '\n');
    const percentage = getAnswerPercentage(question, interaction.values);

    const correct_text = correct.map(v => v.label + '\n').join('');

    await interaction.update({
        content: `${question.question}\nYour answer: ${given_answers.join('')}Correct answer${correct.length > 1 ? 's' : ''}: ${correct_text}\n${getQuote(percentage)}`,
        components: []
    });



}

module.exports = { questions, parseQuestion, createQuestionMenu }