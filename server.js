const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const axios = require('axios');
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.end('Hello World!');
});

app.get("/list_movies", (req, res) => {
  fs.readFile(__dirname + '/' + 'movies.json', 'utf8', (err, data) => {
    res.end(data);
  });
});

const optionsget = {
    host: 'https://apitest2.smartsevak.com/places',
    method: 'GET'
};

const distance = function(lat1, lat2, lon1, lon2) {
   
        // The math module contains a function
        // named toRadians which converts from
        // degrees to radians.
        lon1 =  lon1 * Math.PI / 180;
        lon2 = lon2 * Math.PI / 180;
        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;
   
        // Haversine formula
        let dlon = lon2 - lon1;
        let dlat = lat2 - lat1;
        let a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2),2);
               
        let c = 2 * Math.asin(Math.sqrt(a));
        // Radius of earth in kilometers. Use 3956
        // for miles
        let r = 6371;
        // calculate the result
        return(c * r);
}

const axiosInstance  = axios.create({

})

app.post("/smartsevak-places", async(req, res, next) => {
  const lat= 26.9196;
  const long = 75.7880;

  const response = await axiosInstance.get("https://apitest2.smartsevak.com/places");

  for (const type of response.data.data) {  
    type.distance = distance(type.lat, lat,type.lng, long);
  }
  response.data.data.sort((a, b) => (a.distance > b.distance ? 1: -1))
  res.status(200).send(response.data.data);
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
});