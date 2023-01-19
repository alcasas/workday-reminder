let workdayTab = {};

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

const dailyReminder = (playSound) => {
  chrome.notifications.create({
    title: 'Hey, remember to fill your workday',
    message: 'Click here to open workday',
    type: 'basic',
    iconUrl: '/icons/clock.png',
    requireInteraction: true,
  });
  if (playSound) {
    chrome.tts.speak('Hey, remember to fill your workday', { rate: 0.85 });
  }
};

const weeklyReminder = (playSound) => {
  chrome.notifications.create({
    title: 'Hey, remember to review your week in workday',
    message: 'Click here to open workday',
    type: 'basic',
    iconUrl: '/icons/clock.png',
    requireInteraction: true,
  });
  if (playSound) {
    chrome.tts.speak('Hey, remember to review your week in workday', {
      rate: 0.85,
    });
  }
};

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

const checkHour = () => {
  const date = new Date();
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  const timeStr = hours + ':' + minutes;

  console.log('hour check', timeStr);

  chrome.storage.local.get(
    ['dailyReminder', 'dailyTime', 'weeklyReminder', 'fridayTime', 'playSound'],
    (result) => {
      if (
        result.dailyReminder &&
        result.dailyTime &&
        result.dailyTtime === timeStr
      ) {
        dailyReminder(result.playSound);
      }
      if (
        result.weeklyReminder &&
        result.weeklyTime &&
        result.weeklyTime === timeStr &&
        new Date().getDay() === 5
      ) {
        weeklyReminder(result.playSound);
      }
    }
  );
};

const init = () => {
  setDefaultConfig();
  checkHour();
  setInterval(checkHour, 30 * 1000);

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
};

init();
