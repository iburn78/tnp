const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require("path")

let local_settings = JSON.parse(fs.readFileSync('local_settings.json'));
const options = {
  key: fs.readFileSync(local_settings.key),
  cert: fs.readFileSync(local_settings.cert)
};

// Create a service (the app object is just a callback).
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public')); 
app.use(express.urlencoded({extended:true})); 

// Create an HTTP service.
http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443, () => {
  console.log('HTTPS')
}); 

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap-icons')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

app.get("*", (req, res, next) => {
    console.log("req.secure == " + req.secure);
    if(req.secure){
        // --- https
        console.log('pass')
        next()
    }else{
        // -- http
        return res.redirect("https://" + req.headers.host + req.url);
    }
})

app.get("/about", (req, res) => {
    res.render('about')
})

app.get("/", (req, res) => {
    res.render('main', {})
})

app.post("/", (req, res) => {
    console.log(req.body)
    console.log(req.body.search_input)
    res.render('main', {code: req.body.search_input})
})

app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});