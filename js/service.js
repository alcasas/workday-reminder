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

const dailyNotification = (playSound) => {
  let title = 'Hey, remember to fill your workday';
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

const weeklyNotification = (playSound) => {
  let title = 'Hey, remember to review your week in workday';

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
      chrome.tts.speak(title, {
        rate: 0.85,
      });
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
      if (dailyReminder && dailyTime && dailyTime === timeStr) {
        dailyNotification(playSound);
      }
      if (
        weeklyReminder &&
        fridayTime &&
        fridayTime === timeStr &&
        new Date().getDay() === 5
      ) {
        weeklyNotification(playSound);
      }
    }
  );
};

setDefaultConfig();
