const {google} = require('googleapis');
const express = require('express');
const router = express.Router();

const googleConfig = {
    clientId: '[your clientId]', 
    clientSecret: '[your clientSecret]', 
    redirect: '[your redirect url ]' 
};

let googlePlus;

  function createConnection() {
    return new google.auth.OAuth2(
      googleConfig.clientId,
      googleConfig.clientSecret,
      googleConfig.redirect
    );
  }

  const userScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  function getConnectionUrl(auth) {
    return auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
      scope: userScope
    });
  }

  function urlGoogle() {
    const auth = createConnection(); // this is from previous step
    const url = getConnectionUrl(auth);
    return url;
  }

  function getGooglePlusApi(auth) {
    return google.plus({ version: 'v1', auth });
  }

  router.get('/login', function(req, res, next) {
    res.redirect(urlGoogle());
  });

  router.get('/callback',  async function(req, res, next) {
    let code = req.query.code || null;
    const auth = createConnection();
    const data = await auth.getToken(code);
    const tokens = data.tokens;
    auth.setCredentials(tokens);
    googlePlus = getGooglePlusApi(auth);
    res.redirect("http://localhost:4000")
  });

  router.get('/userEmail', async function(req, res, next) {
    const me = await googlePlus.people.get({ userId: 'me' });
    const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
    res.send(userGoogleEmail); 
  });

  router.get('/userName', async function(req, res, next) {
    const me = await googlePlus.people.get({ userId: 'me' });
    const userGoogleName = me.data.displayName;
    res.send(userGoogleName); 
});
  
  module.exports = router;