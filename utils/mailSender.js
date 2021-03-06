var nodemailer = require('nodemailer');

var MailSender = {};

//=============================================================================
module.exports = MailSender;

//-----------------------------------------------------------------------------
function createTransport() {
  return nodemailer.createTransport({
      service: 'hotmail',
      auth: {
          user: 'Hungry4Zone@outlook.com',
          pass: 'H4Z.2015Recipes'
      }
    });

}

//-----------------------------------------------------------------------------
MailSender.Welcome = function (email, name, callback) {
    var transporter = createTransport();
    transporter.sendMail({
        from: 'Hungry4Zone@outlook.com',
        to: email,
        subject: 'Benvenuto in Hungry 4 Zone!',
        html: '<b>Benvenuto ' + name + '!</b><br/>' +
              'La tua registrazione è stata completata correttamente. Il tuo indirizzo e-mail ci sarà utile in caso dimenticassi la tua password.<br/>' +
              'Inizia subito a scoprire le nostre ricette!'
    }, callback);
};

//-----------------------------------------------------------------------------
MailSender.ResetPassword = function (email, pin, callback) {
  var transporter = createTransport();
    transporter.sendMail({
        from: 'Hungry4Zone@outlook.com',
        to: email,
        subject: 'Ripristino password dimenticata',
        html: "Ecco come sostituire la password che hai dimenticato con una nuova:<br/>" +
              "<ol><li>Segui questo link: <a href='http://" + global.H4ZURL + "/#/resetPassword'>http://www.Hungry4Zone.com/resetPassword</a></li>" +
              "<li>Usa il seguente Codice di Sicurezza temporaneo: <b>" + pin + "</b></li>" +
              "<li>Segui le istruzioni per impostare una nuova password</li>"
    }, callback);
};

//-----------------------------------------------------------------------------
MailSender.ChangedPassword = function (email, name, callback) {
  var transporter = createTransport();
    transporter.sendMail({
        from: 'Hungry4Zone@outlook.com',
        to: email,
        subject: 'Conferma modifica password',
        html: '<b>Buongiorno ' + name + '!</b><br/>' +
              'Ti confermiamo che la tua nuova password è stata memorizzata correttamente.<br/>' +
              'Torna spesso a guardare le nostre ricette!'
    }, callback);
};

//-----------------------------------------------------------------------------
MailSender.UnknownResetRequest = function (email, callback) {
  var transporter = createTransport();
    transporter.sendMail({
        from: 'Hungry4Zone@outlook.com',
        to: email,
        subject: 'Utente sconosciuto su Hungry 4 Zone',
        html: 'Ciao. Hai chiesto di recuperare la tua password su <b>Hungry 4 Zone</b>, ma non ci risulta alcun utente associato a questa e-mail.<br/>' +
              'Forse hai usato un altro indirizzo e-mail quando ti sei registrato, hai conservato il messaggio di benvenuto?<br/><br/>' +
              'Se invece non hai mai chiesto il recupero della tua password o non ti sei mai iscritto presso di noi, qualcuno sta usando in modo improprio il tuo indirizzo e-mail.'
    }, callback);
};
