## Improving Workday Reminder

This is an Edge/Chrome extension for Improving folks to remember to fill Workday, this shows up a notification and opens Workday in a new tab showing the modal form to capture a new activity.

Also an alert is displayed every 15th and 30th to remember to review current period.

### Configurable items:

- Display daily alerts and the hour
- Display weekly alerts and the hour (on Friday)
- Play sound

### Installation

You can clone the repo

> git clone https://github.com/alcasas/workday-reminder.git

Or download the compressed file and decompress it

> [https://github.com/alcasas/workday-reminder/archive/master.zip](https://github.com/alcasas/workday-reminder/archive/master.zip)

Then:

Open [chrome://extensions](chrome://extensions) in Google Chrome or [edge://extensions](edge://extensions) for Edge and then activate "developer mode", click on "Load unpackaged extension..." and select the folder where you cloned it or decompressed it.

### Notes

- Remember to allow notifications for Edge/Chrome, if this is not allowed by the OS the notification will not appear, but sound will be played if enabled in configuration
- No session is involved in this extension
