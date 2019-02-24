const express = require('express');
const router = express.Router();
var request = require('request');
var querystring = require('querystring')

let access_token;

const facebookConfig = {
    clientId: '[your clientId]', 
    clientSecret: '[your clientSecret]', 
    redirect: '[your redirect url ]' 
};

router.get('/login', function(req, res, next) {
    res.redirect('https://www.facebook.com/v3.2/dialog/oauth?' +
      querystring.stringify({
        client_id:  facebookConfig.clientId,
        redirect_uri: facebookConfig.redirect,
        state: 'st=state123abc,ds=123456789'
    }))
});

router.get('/callback', function(req, res, next) {
    let code = req.query.code || null
    let authOptions = {
        form: {
            client_id: facebookConfig.clientId,
            redirect_uri: facebookConfig.redirect,
            client_secret: facebookConfig.clientSecret,
            code: code,
            grant_type: 'client_credentials'
        },
        json: true
    }
    request.get('https://graph.facebook.com/v3.2/oauth/access_token?',authOptions, function(error, response, body) {
        if(error){
            console.error(error);
        }
        else{
            access_token = body.access_token;
        }        
    })
    res.redirect("http://localhost:4000");
});

router.get('/userBirthday', function(req, res, next) {
    request.get('https://graph.facebook.com/v3.2/me?fields=birthday?access_token='+access_token ,function(err,response,body){
      if(res.statusCode !== 200 ){
        res.send(err);
      } 
      res.send(body); 
    });
});
  
module.exports = router;