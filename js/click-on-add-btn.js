//yes i'll be injected to the site
let addBtnInterval = setInterval(() => {
  const button = document.querySelector(
    '[data-automation-id=pex-card-task-button]'
  );
  if (button) {
    clearInterval(addBtnInterval);
    button.click();
  }
}, 100);
