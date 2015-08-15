function GetErrorMessage(httpResponse) {
  if (httpResponse && httpResponse.data && httpResponse.data.message) {
    return httpResponse.data.message;
  } else if (httpResponse && httpResponse.data) {
    return "Errore sul server: " + httpResponse.data;
  } else {
    return "Errore sconosciuto sul server";
  }
}
