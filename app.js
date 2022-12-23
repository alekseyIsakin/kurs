"use strict";

const fs = require("fs");
const express = require('express');
const path = require('path');
const app = express();
const jsonParser = express.json();


const port = 3000;
const thumbnails = './static/images/thumbnails';

let image_array = []

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

fs.readdir(thumbnails, (err, files) => {
  files.forEach(file => {
    image_array.push(file);
  });
});

app.use(express.static(path.join(__dirname, 'static')));


app.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, 'static/html/about.html'))
})

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'static/html/index.html'))
});



app.get("/thumbs", jsonParser, function (request, response) {
  if (!request.body) return response.sendStatus(400);

  const from = request.query.from
  const to = Math.min(request.query.to, image_array.length)
  const send_img = []

  for (let i = 0; i < to - from; i++) {
    const rnd = getRandomInt(image_array.length)

    send_img.push(image_array[rnd])
  }
  response.json(send_img)
});


app.listen(port, function (error) {
  if (!error)
    console.log("Server is Listening at Port 3000!");
  else
    console.log("Error Occurred");
});
