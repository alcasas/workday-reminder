let workdayTab = {};

//crhome stuff
chrome.notifications.onClicked.addListener((notificationId) => {
  chrome.notifications.clear(notificationId);
  chrome.tabs.create(
    {
      selected: true,
      active: true,
      url: 'https://workday.improving.com',
    },
    (tab) => {
      workdayTab = tab;
    }
  );
});

chrome.alarms.create({
  periodInMinutes: 1,
});

chrome.alarms.onAlarm.addListener(() => {
  checkHour();
});

chrome.tabs.onUpdated.addListener((tabId, changes) => {
  if (tabId === workdayTab.id && changes.url) {
    if (changes.url.indexOf('home.htmld') !== -1) {
      chrome.scripting.executeScript({
        target: { tabId: workdayTab.id },
        files: ['js/click-on-add-btn.js'],
      });
    }
    if (changes.url.indexOf('d/task/') !== -1) {
      chrome.scripting.executeScript({
        target: { tabId: workdayTab.id },
        files: ['js/click-on-today-btn.js'],
      });
    }
  }
});

//reminder stuff
const setDefaultConfig = () => {
  chrome.storage.local.get(['dailyTime'], (result) => {
    if (!result.dailyTime) {
      chrome.storage.local.set({ dailyTime: '16:50' });
    }
    if (!result.fridayTime) {
      chrome.storage.local.set({ fridayTime: '16:55' });
    }
    let keys = Object.keys(result);
    if (!keys.dailyReminder) {
      chrome.storage.local.set({
        dailyReminder: true,
      });
    }
    if (!keys.weeklyReminder) {
      chrome.storage.local.set({
        weeklyReminder: true,
      });
    }
    if (!keys.playSound) {
      chrome.storage.local.set({
        playSound: true,
      });
    }
  });
};

const createNotification = (title, playSound) => {
  chrome.notifications.getAll((notifications) => {
    let notificationsKeys = Object.keys(notifications);
    chrome.tts.stop();

    for (let notificationId of notificationsKeys) {
      chrome.notifications.clear(notificationId);
    }

    chrome.notifications.create({
      title,
      message: 'Click here to open workday',
      type: 'basic',
      iconUrl: '/icons/clock.png',
      requireInteraction: true,
    });

    if (playSound) {
      chrome.tts.speak(title, { rate: 0.85 });
    }
  });
};

const checkHour = () => {
  const date = new Date();
  const dateHour = date.getHours();
  const dateMinutes = date.getMinutes();
  const hours = dateHour < 10 ? '0' + dateHour : dateHour;
  const minutes = dateMinutes < 10 ? '0' + dateMinutes : dateMinutes;
  const timeStr = hours + ':' + minutes;

  chrome.storage.local.get(
    ['dailyReminder', 'dailyTime', 'weeklyReminder', 'fridayTime', 'playSound'],
    ({ dailyReminder, dailyTime, weeklyReminder, fridayTime, playSound }) => {
      //handle daily notification
      if (dailyReminder && dailyTime && dailyTime === timeStr) {
        createNotification('Hey, remember to fill your workday', playSound);
      }

      //handle weekly notification
      if (
        weeklyReminder &&
        fridayTime &&
        fridayTime === timeStr &&
        date.getDay() === 5
      ) {
        createNotification(
          'Hey, remember to review your week in workday',
          playSound
        );
      }

      //handle period notification
      let dayOfMonth = date.getDate();
      let month = date.getMonth();
      let finalDay = 30;
      if (month === 1) {
        finalDay = 28;
      }
      if (
        timeStr === '16:50' &&
        (dayOfMonth === 15 || dayOfMonth === finalDay)
      ) {
        createNotification(
          'Hey, tomorrow is the Workday lockdown, please review current period',
          playSound
        );
      }
    }
  );
};

setDefaultConfig();
