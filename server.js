'use strict';

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const app = express();

app.use(cors());
require('dotenv').config();


const PORT = process.env.PORT || 3000;

app.get('/location', (request, response) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GOOGLE_API_KEY}`;
  return superagent.get(url)

    .then(result => {
      const locationResult = new LocationData (result, request);
      response.send(locationResult);
      console.log(locationResult);
    });
});

function LocationData(result, request) {
  this.search_query = request.query.data;
  this.formatted_query = result.body.results[0].formatted_address,
  this.latitude = result.body.results[0].geometry.location.lat,
  this.longitude = result.body.results[0].geometry.location.lng
}


app.listen(PORT, () => console.log(`Listening on ${PORT}`));

