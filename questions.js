const { MessageSelectMenu, MessageActionRow } = require('discord.js');
const { getMotivationQuote, getAlmostQuote, getBadQuote } = require('./quotes');

const questions = [
    {
        question: 'Bij wie hoort "Machtafstand"?',
        answers: [
            { label: 'Hofstede', correct: true, value: '1' },
            { label: 'Hall', correct: true, value: '2' },
            { label: 'Kluckhohn', correct: true, value: '3' },
            { label: 'Trompenaars en Hampden-Turner', correct: true, value: '4' }
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
                percentage = percentage - deduct_points;
        } else {
            if (answer.correct)
                percentage = percentage - deduct_points;
        }
    });
    return (Math.round(percentage) * 100) / 100;
}

const parseQuestion = async (interaction) => {
    const question = getQuestionByName(interaction.message.content);
    const correct = getCorrectAnswersFromQuestion(question);
    const given_answers = interaction.values.map(v => getAnswerFromQuestion(question, v).label + '\n');
    const percentage = getAnswerPercentage(question, interaction.values);

    const correct_text = correct.map(v => v.label + '\n').join('');

    await interaction.update({
        content: `${question.question}\nYour answer: ${given_answers.join('')}Correct answer(s): ${correct_text}\n\n${getQuote(percentage)}`,
        components: [new MessageActionRow().addComponents(
            createQuestionMenu(question).setDisabled()
        )]
    });



}

module.exports = { questions, parseQuestion, createQuestionMenu }