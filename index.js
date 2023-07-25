const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/tnpartners.net/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/tnpartners.net/fullchain.pem')
};

// Create a service (the app object is just a callback).
const app = express();

// Create an HTTP service.
http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443, () => {
  console.log(`Example app listening on port 443`)
}); 

app.get("*", (req, res) => {
    console.log("req.secure == " + req.secure);

    if(req.secure){
        // --- https
        res.send('HELLO WORLD')
    }else{
        // -- http
        let to = "https://" + req.headers.host + req.url;
        console.log("to ==> " + to);

        return res.redirect("https://" + req.headers.host + req.url);
    }
})
// app.get('/', (req, res) => {
//});

