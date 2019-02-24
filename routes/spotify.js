var express = require('express');
var router = express.Router();
var request = require('request');
var querystring = require('querystring')

let uri = 'http://localhost:4000'
let access_token;
let  redirect_uri = 'http://localhost:4000/spotify/callback';

const spotifyConfig = {
  clientId: '[your clientId]', 
  clientSecret: '[your clientSecret]', 
  redirect: '[your redirect url ]' 
};

router.get('/login', function(req, res, next) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id:  spotifyConfig.clientId,
      scope: 'user-read-private user-read-email',
      redirect_uri
    }))
});

router.get('/callback', function(req, res, next) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        spotifyConfig.clientId + ':' + spotifyConfig.clientSecret
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    access_token = body.access_token
    res.redirect(uri)
    // res.redirect(uri + '?access_token=' + access_token)
  })
});

router.get('/me', function(req, res, next) {
  let meOptions = {
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    json: true
  }
  request.get('https://api.spotify.com/v1/me',meOptions,function(err,response,body){
    if(res.statusCode !== 200 ){
      res.send(err);
    } 
    res.send(body); 
  });

});

router.get('/search', function(req, res, next) {
  let meOptions = {
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    json: true
  }
  request.get('https://api.spotify.com/v1/search?q=tania%20bowra&type=artist',meOptions,function(err,response,body){
    if(res.statusCode !== 200 ){
      res.send(err);
    } 
    res.send(body); 
  });
});

router.get('/userPlaylists', function(req, res, next) {
  let Options = {
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    json: true
  }
  request.get('https://api.spotify.com/v1/me/playlists',Options,function(err,response,body){
    if(res.statusCode !== 200 ){
      res.send(err);
    } 
    res.send(body); 
  });
});

module.exports = router;




