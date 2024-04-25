function main() {
  var d = new Date();
  if (d.getDay() == 5) /*Don't send email reminders on Shabbos*/ { 
    return;
  }
  var hebcalJSON = getSefiraDay(getHebcalDay(addDays(d, 1))); // get that NIGHT'S number, which will be the next day (changes at 12:00, not shkiya)
  console.log("SefiraDay: " + JSON.stringify(hebcalJSON));
  if (hebcalJSON.items.length === 0) {
    console.log("No sefirah today");
    return;
  }
  else {
    var yesterdayEmail = GmailApp.search("subject: sefira reminder ");
    for (var email in yesterdayEmail) {
      yesterdayEmail[email].moveToTrash();
    }
    GmailApp.sendEmail(Session.getActiveUser().getEmail(), "Sefira Reminder", `Remember to count Sefira! Tonight is night ${hebcalJSON.items[0].title_orig.replaceAll("Omer ", "")}`});
  }
}

function getSefiraDay(day) {
  return JSON.parse(UrlFetchApp.fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&maj=off&min=off&mod=off&nx=off&start=${day}&end=${day}&ss=off&lg=a&mf=off&c=off&M=off&s=off&o=on`).getContentText());
}

const getHebcalDay = d => `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
