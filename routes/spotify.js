var express = require('express');
var router = express.Router();
var spotifyService = require('../services/spotify');

let uri = 'http://localhost:4000'

router.get('/login', function(req, res, next) {
  res.redirect(spotifyService.loginUser())
});

router.get('/callback', async function(req, res, next) {
  let code = req.query.code || null
  let status = await spotifyService.myCode(code);
  res.redirect(uri)
    // res.redirect(uri + '?access_token=' + access_token)
});

router.get('/username', async function(req, res, next) {
  try{
    let user = await spotifyService.getUserName();
    user = user + "  " + "its me";
    res.send(user);
  }
  catch(err){
    res.status("500").send(err);
  }
});

router.get('/search', async function(req, res, next) {
  try{
    let artist = await spotifyService.searchArtist();
    res.send(artist);
  }
  catch(err){
    res.status("500").send(err);
  }
});

module.exports = router;




