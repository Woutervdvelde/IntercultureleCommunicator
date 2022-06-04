const LocalStorage = require('node-localstorage').LocalStorage;
const Store = new LocalStorage('./scratch');

const getUserStats = (user_id) => JSON.parse(Store.getItem(user_id)) ?? { right: 0, wrong: 0 };
const setUserStats = (user_id, settings) => Store.setItem(user_id, JSON.stringify(settings));
const getNotificationList = () => JSON.parse(Store.getItem('notify')) ?? [];
const setNotificationList = (list) => Store.setItem('notify', JSON.stringify(list));

const sendNotifications = (client) => {
    console.log(`${new Date()}sending notification`);
    const command = client.commands.find(c => c.name == 'ask');
    const list = getNotificationList();
    list.forEach(async user_id => {
        const user = await client.users.fetch(user_id);
        if (!user) return;
        command.execute(user);
    });
}

const max = parseInt(process.env.NOTIFICATION_MAX_TIME) ?? 30;
const min = parseInt(process.env.NOTIFICATION_MIN_TIME) ?? 10;

const triggerNotificationInterval = async (client) => {
    const timeout = Math.floor(Math.random() * (max - min) + min) * 60 * 1000;
    setTimeout(() => { sendNotifications(client); triggerNotificationInterval(client); }, timeout);
}

module.exports = { triggerNotificationInterval, getUserStats, setUserStats, getNotificationList, setNotificationList }