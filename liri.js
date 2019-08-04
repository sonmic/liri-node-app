require("dotenv").config(); //set any environment variables with the dotenv package
const keys = require("./keys.js"); //to import the keys.js file and store it in a variable.

const axios = require('axios');
const moment = require('moment');
const Spotify = require('node-spotify-api');
const fs = require('fs');
const spotify = new Spotify(keys.spotify); //You should then be able to access your keys information

function liri(userCommand, argument) {
    switch (userCommand) {
        case "concert-this":
            const artist = argument;
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
            let thisSong;
            if (argument === undefined) {
                thisSong = "track:\"The Sign\" artist:\"Ace of Base\"";
            } else {
                thisSong = argument;
            };

            spotify.search({ type: 'track', query: thisSong }, function(err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                for (let i = 0; i < data.tracks.items.length; i++) {
                    const item = data.tracks.items[i];
                    console.log('Song: ' + item.name);
                    console.log('Album: ' + item.album.name);
                    console.log('Preview: ' + item.preview_url);

                    for (let j = 0; j < item.artists.length; j++) {
                        console.log('Artist: ' + item.artists[j].name + "\n\n");
                    }
                }
            });
            break;
        case "movie-this":
            let thisMovie;
            if (argument === undefined) {
                thisMovie = "Mr. Nobody";
            } else {
                thisMovie = argument;
            };

            axios.get("http://www.omdbapi.com/?t=" + thisMovie + "&y=&plot=short&apikey=trilogy").then(
                function(response) {
                    const data = response.data;
                    console.log('Title: ' + data.Title);
                    console.log('Year: ' + data.Year);
                    console.log('IMDB Rating: ' + data.imdbRating);

                    for (let i = 0; i < data.Ratings.length; i++) {
                        const rating = data.Ratings[i];
                        if (rating.Source == "Rotten Tomatoes") {
                            console.log('Rotten Tomatoes Rating: ' + rating.Value);
                        }

                    }

                    console.log('Country: ' + data.Country);
                    console.log('Language: ' + data.Language);
                    console.log('Plot: ' + data.Plot);
                    console.log('Actors: ' + data.Actors);
                });

            break;
        case "do-what-it-says":
            const contents = fs.readFileSync('random.txt', 'utf8');
            const commaIndex = contents.indexOf(',');
            const newCommand = contents.substring(0, commaIndex);
            const newArgument = contents.substring(commaIndex + 1).replace(/"(.*)"/, "$1");
            liri(newCommand, newArgument);
            break;
        default:
            console.log("Unknown command : ", userCommand);
    }
}

const userCommand = process.argv[2];
const argument = process.argv[3];

liri(userCommand, argument);