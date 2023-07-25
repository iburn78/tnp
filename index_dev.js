const express = require('express');
const http = require('http');
const fs = require('fs');

// Create a service (the app object is just a callback).
const app = express();

// Create an HTTP service.
http.createServer(app).listen(3000);

app.get("*", (req, res) => {
    console.log("dev server");
    res.send('HELLO WORLD --- ')

})
// app.get('/', (req, res) => {
//});

