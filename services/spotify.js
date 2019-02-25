var request = require('request');
var querystring = require('querystring')

let access_token;
let  redirect_uri = 'http://localhost:4000/spotify/callback';

const spotifyConfig = {
    clientId: '8cb87dc670244a6c80af175d5ecf2b1c', 
    clientSecret: '0791e327394143bf9a9249f655936d8b', 
    redirect: 'http://localhost:4000/spotify/callback' 
};

class SpotifyService{
    loginUser(){
        return 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
          response_type: 'code',
          client_id:  spotifyConfig.clientId,
          scope: 'user-read-private user-read-email',
          redirect_uri
        });
    }
    
    async myCode(code){
        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
              code: code,
              redirect_uri,
              grant_type: 'authorization_code'
            },
            headers: {
              'Authorization': 'Basic ' + (new Buffer.from(
                spotifyConfig.clientId + ':' + spotifyConfig.clientSecret
              ).toString('base64'))
            },
            json: true
        }
        return new Promise((resolve, reject) => {
            request.post(authOptions, function(error, response, body) {
                if(error){
                    reject(error);
                }
                access_token = body.access_token
                resolve("ok");
                // res.redirect(uri + '?access_token=' + access_token)
              })
        });
    }

    async getUserName(){
        let meOptions = {
            headers: {
            'Authorization': 'Bearer ' + access_token
            },
            json: true
          }
          return new Promise((resolve, reject) => {
            request.get('https://api.spotify.com/v1/me',meOptions,function(err,response,body){
              if(err){
                reject(err);
              }   
              resolve(body.display_name);
            });      
          });
    }
   
    async searchArtist(){
        let meOptions = {
            headers: {
            'Authorization': 'Bearer ' + access_token
            },
            json: true
          }
          return new Promise((resolve, reject) => {
            request.get('https://api.spotify.com/v1/search?q=eminem&type=artist',meOptions,function(err,response,body){
              if(err){
                reject(err);
              }   
              resolve(body.artists);
            });      
          });
    }  

}

const spotifyService = new SpotifyService();
module.exports = spotifyService;