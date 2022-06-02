const motivational_quotes = [
    "Wow, nice one!",
    "I knew you could do it",
    "Too easy",
    "How are you even stressing?",
    "Beautiful brain you've got there"
]

const almost_quotes = [
    "Almost there, but not yet",
    "Soooooo close",
    "Don't lose hope, you're so close",
    "Got to learn a little bit better",
    "Still got some work to do",
    "Don't give up! You're almost there"
]

const bad_quotes = [
    "keep the 27th of June free",
    "How....",
    "What were you thinking?!",
    "You blithering idiot _(Jeremy Clarkson voice)_",
    "Did you even learn?"
]

const getRandom = (array) => array[Math.floor(Math.random() * array.length)];
const getMotivationQuote = () => getRandom(motivational_quotes);
const getAlmostQuote = () => getRandom(almost_quotes);
const getBadQuote = () => getRandom(bad_quotes);

module.exports = { getMotivationQuote, getAlmostQuote, getBadQuote }