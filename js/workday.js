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
  const dailyTime = document.getElementById('dailyTime');
  const fridayTime = document.getElementById('fridayTime');
  const playSound = document.getElementById('playSound');
  const dailyReminder = document.getElementById('dailyReminder');
  const weeklyReminder = document.getElementById('weeklyReminder');

  saveBtn.addEventListener('click', saveConfig);

  chrome.storage.local.get(
    ['dailyTime', 'fridayTime', 'playSound', 'dailyReminder', 'weeklyReminder'],
    (result) => {
      dailyTime.value = result.dailyTime;
      fridayTime.value = result.fridayTime;
      playSound.checked = result.playSound;
      dailyReminder.checked = result.dailyReminder;
      weeklyReminder.checked = result.weeklyReminder;
    }
  );
});
