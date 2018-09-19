'use strict';

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const app = express();

app.use(cors());
require('dotenv').config();

app.get('/weather', getWeather);

const PORT = process.env.PORT || 3000;

app.get('/location', (request, response) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GOOGLE_API_KEY}`;
  return superagent.get(url)

    .then(result => {
      const locationResult = new LocationData (result, request);
      response.send(locationResult);
      console.log(locationResult);
    })
    .catch( error => handleError(error, response));
});

// constructor function for geolocation - called upon inside the request for location
function LocationData(result, request) {
  this.search_query = request.query.data;
  this.formatted_query = result.body.results[0].formatted_address,
  this.latitude = result.body.results[0].geometry.location.lat,
  this.longitude = result.body.results[0].geometry.location.lng
}

//send request to DarkSkys API and gets data back, then calls on Weather function to display data
function getWeather(request, response) {
  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;
  return superagent.get(url)

    .then( result => {
      const weatherSummaries = [];
      result.body.daily.data.map( day => {
        return new Weather(day);
      })
      response.send(weatherSummaries)
      console.log(weatherSummaries);
    })
    .catch( error => handleError(error, response));
}

function handleError(err, res) {
  console.error(err);
  if (res) res.status(500).send('Sorry, something went wrong');
}

function Weather(day) {
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
  this.forecast = day.summary;
}


app.listen(PORT, () => console.log(`Listening on ${PORT}`));

