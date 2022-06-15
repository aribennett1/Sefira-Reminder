function main() {
  var d = new Date();
  if (d.getDay() == 5) /*Don't send email reminders on Shabbos*/ { 
    return;
  }
  d = addDays(d, 1); // get that NIGHT'S number, which will be the next day (changes at 12:00, not shkiya)
  var hebcalDay = getHebcalDay(d);
  var sefirahDay = getSefiraDay(hebcalDay);
  console.log("SefiraDay: " + sefirahDay);
  if (sefirahDay == "{\"ti") /*This is what the function returns when there's no sefira*/ {
    console.log("No sefirah today");
    return; //This is the equivalent of System.exit(0)
  }
  else {
    var yesterdayEmail = GmailApp.search("subject: sefira reminder ");
    for (var email in yesterdayEmail) {
      yesterdayEmail[email].moveToTrash();
    }
    GmailApp.sendEmail(Session.getActiveUser().getEmail(), "Sefira Reminder", `Remember to count Sefira! Tonight is night ${sefirahDay}`});
  }
}

function getSefiraDay(today) {
  var hebcal =  UrlFetchApp.fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&maj=off&min=off&mod=off&nx=off&start=${today}&end=${today}&ss=off&lg=a&mf=off&c=off&M=off&s=off&o=on`).getContentText();
  return hebcal.substring(hebcal.indexOf("Omer ") + 5, hebcal.indexOf("hebrew") - 3);
}

function getHebcalDay(d) {
  var day = d.getDate();
  day = addLeadingZeroIfLenIsOne(day);
  let month = d.getMonth() + 1; //Google's months are 0-11, HebCal's months are 1-12, so +1 to Google's month for use in Hebcal
  month = addLeadingZeroIfLenIsOne(month);
  let year = d.getFullYear();
  var hebcalDay = `${year}-${month}-${day}`;
  // console.log(`hebcalDay: ${hebcalDay}`);
  return hebcalDay;
}

function addLeadingZeroIfLenIsOne(num) {
if (num.toString().length == 1) {
    num = "0" + num;
  }
  return num;
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
