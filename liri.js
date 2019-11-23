require("dotenv").config();


var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var request = require("request");
var moment = require("moment");
var spotify = new Spotify(keys.spotify);

var input = process.argv;
var command = input[2];


var name = "";

for (var i = 3; i < input.length; i++) {
  if (i > 3 && i < input.length) {
    name = name + "+" + input[i];
  } else {
    name += input[i];
  }
}

questionSwitch();

function questionSwitch() {
  switch (command) {
    case "concert-this":
      searchBandsInTown(name);
      break;

    case "spotify-this-song":
      searchSpotify(name);
      break;

    case "movie-this":
      searchOMDB(name);
      break;

    case "do-what-it-says":
      doWhatItSays();
      break;

    default:
      console.log("sorry, try again.");
  }
}

function searchBandsInTown() {
  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    name +
    "/events?app_id=codingbootcamp";
  console.log(queryUrl);
  request(queryUrl, function(error, response, body) {
    // If the request is successful
    var pbody = JSON.parse(body);
    if (!error && response.statusCode === 200) {
      pbody.forEach(function(element) {
        console.log("Venue name - " + element.venue.name);
        console.log(
          "Venue Location - " +
            element.venue.city +
            " , " +
            element.venue.region +
            "  - " +
            element.venue.country
        );
        console.log("Date - " + moment(element.datetime).format("MM/DD/YYYY"));
      });
    }
  });
}

function searchSpotify() {
  if (name === "") {
    name = "The Sign Ace of Base";
  }

  spotify.search({ type: "track", query: name, limit: "5" }, function(
    error,
    data
  ) {
    if (error) {
      return console.log("Error occurred: " + error);
    }

    var song = data.tracks.items[0];
    console.log("Artist(s) - " + song.artists[0].name);
    console.log("Name of song - " + song.name);
    console.log("Preview link on spotify - " + song.preview_url);
    console.log("Album - " + song.album.name);
  });

  
}

function searchOMDB() {
  
  if (name === "") {
    name = "Mr. Nobody";
  }

  var queryUrl =
    "http://www.omdbapi.com/?t=" +
    name +
    "&y=&plot=short&tomatoes=true&apikey=trilogy";

  request(queryUrl, function(error, response, body) {
    
    if (!error && response.statusCode === 200) {
      
      var pbody = JSON.parse(body);
      console.log("Title - " + pbody.Title);
      console.log("Release Year: - " + pbody.Year);
      console.log("IMDB Rating - " + pbody.imdbRating);
      console.log("Rotten Tomatoes Rating - " + pbody.tomatoRating);
      console.log("Country where the movie was produced - " + pbody.Country);
      console.log("Language - " + pbody.Language);
      console.log("Plot - " + pbody.Plot);
      console.log("Actors - " + pbody.Actors);
    }
  });
}

function doWhatItSays() {
  fs.readFile("./random.txt", "utf8", function(error, fileText) {
    if (error) throw error;

    fileText = fileText.split(",");
    command = fileText[0];
    console.log(command);
    name = fileText[1];
    console.log(name);
    questionSwitch();
  });
}