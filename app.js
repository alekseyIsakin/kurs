"use strict";

const fs = require("fs");
const express = require('express');
const path = require('path');
const app = express();
const jsonParser = express.json();


const port = 3000;
const testFolder = './static/images/thumbnails';

let image_array = []

fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    image_array.push(file);
  });
});

app.use(express.static(path.join(__dirname, 'static')));


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'static/html/index.html'))
});



app.get("/thumbs", jsonParser, function (request, response) {
  console.log(request.body);
  if (!request.body) return response.sendStatus(400);

  const from = request.query.from
  const to = Math.min(request.query.to, image_array.length)

  console.log(from, to)
  response.json(image_array.slice(from, to))
  // let filePath = path.join(__dirname, `static/tests/${request.body.from}.json`)

  // fs.readFile(filePath, {encoding: 'utf-8'}, (err, data) =>{
  //   if (!err)
  //     response.sendFile(JSON.parse(data));
  //   else
  //     console.log(err)
  // })
});


app.listen(port, function (error) {
  if (!error)
    console.log("Server is Listening at Port 3000!");
  else
    console.log("Error Occurred");
});
