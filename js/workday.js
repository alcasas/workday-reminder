const saveConfig = () => {
  const dailyTime = document.getElementById('dailyTime');
  const fridayTime = document.getElementById('fridayTime');
  const playSound = document.getElementById('playSound');
  const dailyReminder = document.getElementById('dailyReminder');
  const weeklyReminder = document.getElementById('weeklyReminder');

  if (dailyTime.value.toString().length === 5) {
    chrome.storage.local.set({ dailyTime: dailyTime.value });
  }
  if (fridayTime.value.toString().length === 5) {
    chrome.storage.local.set({ fridayTime: fridayTime.value });
  }
  chrome.storage.local.set({
    playSound: playSound.checked,
    dailyReminder: dailyReminder.checked,
    weeklyReminder: weeklyReminder.checked,
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('saveBtn');
  const dailyTimeEl = document.getElementById('dailyTime');
  const fridayTimeEl = document.getElementById('fridayTime');
  const playSoundEl = document.getElementById('playSound');
  const dailyReminderEl = document.getElementById('dailyReminder');
  const weeklyReminderEl = document.getElementById('weeklyReminder');

  saveBtn.addEventListener('click', saveConfig);

  chrome.storage.local.get(
    ['dailyTime', 'fridayTime', 'playSound', 'dailyReminder', 'weeklyReminder'],
    ({ dailyReminder, dailyTime, weeklyReminder, fridayTime, playSound }) => {
      dailyTimeEl.value = dailyTime;
      fridayTimeEl.value = fridayTime;
      playSoundEl.checked = playSound;
      dailyReminderEl.checked = dailyReminder;
      weeklyReminderEl.checked = weeklyReminder;
    }
  );
});
