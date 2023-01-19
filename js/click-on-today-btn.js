//yes i'll be injected to the site
let panelInterval = setInterval(() => {
  const alternativeViewBtn = document.querySelector(
    '[title="Alternative Calendar View"]'
  );
  if (alternativeViewBtn) {
    clearInterval(panelInterval);
    alternativeViewBtn.click();
    let buttonsInterval = setInterval(() => {
      let buttons = document.querySelectorAll(
        '[data-automation-id=calendarAccessibleAppointmentClickable]'
      );
      if (buttons.length) {
        clearInterval(buttonsInterval);
        let todayBtn = buttons[new Date().getDay()];
        todayBtn.click();
        const calendarViewBtn = document.querySelector(
          '[title="Calendar View"]'
        );
        calendarViewBtn.click();
      }
    }, 200);
  }
}, 200);
