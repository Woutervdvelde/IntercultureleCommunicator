const LocalStorage = require('node-localstorage').LocalStorage;
const Store = new LocalStorage('./scratch');

const getUserStats = (user_id) => JSON.parse(Store.getItem(user_id)) ?? { right: 0, wrong: 0 };
const setUserStats = (user_id, settings) => Store.setItem(user_id, JSON.stringify(settings));
const getNotificationList = () => JSON.parse(Store.getItem('notify')) ?? [];
const setNotificationList = (list) => Store.setItem('notify', JSON.stringify(list));

module.exports = { getUserStats, setUserStats, getNotificationList, setNotificationList }