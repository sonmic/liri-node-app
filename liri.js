require("dotenv").config(); //set any environment variables with the dotenv package
const keys = require("./keys.js"); //to import the keys.js file and store it in a variable.

const axios = require('axios');
const moment = require('moment');
const Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify); //You should then be able to access your keys information

let userCommand = process.argv[2];

switch (userCommand) {
    case "concert-this":
        const artist = process.argv[3];
        axios({
            url: "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
        }).then(function(response) {

            for (let i = 0; i < response.data.length; i++) {
                console.log(response.data[i].venue.name);
                console.log(response.data[i].venue.city);
                let concertDate = moment(response.data[i].datetime).format('MM/DD/YYYY');
                console.log(concertDate + "\n\n");
            }
        });
        break;
    case "spotify-this-song":
        const thisSong = process.argv[3];
        spotify.search({ type: 'track', query: thisSong }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            for (let i = 0; i < data.tracks.items.length; i++) {
                const item = data.tracks.items[i];
                console.log(item.album.name);
                console.log(item.name);

                for (let j = 0; j < item.artists.length; j++) {
                    console.log(item.artists[j].name);
                }
            }
        });
        break;
    case "movie-this":
        break;
    case "do-what-it-says":
        break;
    default:
        console.log("Unknown command : ", userCommand);
}