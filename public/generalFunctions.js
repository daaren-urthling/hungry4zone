//-----------------------------------------------------------------------------
function GetErrorMessage(httpResponse) {
  if (httpResponse && httpResponse.data && httpResponse.data.message) {
    return httpResponse.data.message;
  } else if (httpResponse && httpResponse.data) {
    return "Errore sul server: " + httpResponse.data;
  } else {
    return "Errore sconosciuto sul server";
  }
}

//-----------------------------------------------------------------------------
function dateCast(date) {
  if (!date.getFullYear) {
    date = new Date(date); date.setHours(0,0,0,0);
  }
  return date;
}

//-----------------------------------------------------------------------------
function addDays(date, days) {
  if (!date.getFullYear) {
    date = new Date(date); date.setHours(0,0,0,0);
  }
  return new Date(date.getFullYear(),date.getMonth(),date.getDate()+days);
}

//-----------------------------------------------------------------------------
function diffDays(date1, date2) {
  date1 = dateCast(date1);
  date2 = dateCast(date2);
  // hours*minutes*seconds*milliseconds --------------------------V
  return Math.round(Math.abs((date1.getTime() - date2.getTime())/(24*60*60*1000)));
}
