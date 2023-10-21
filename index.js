const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const app = express();

let local_settings = JSON.parse(fs.readFileSync('local_settings.json'));
const options = {
  key: fs.readFileSync(local_settings.key),
  cert: fs.readFileSync(local_settings.cert)
};

app.set('view engine', 'ejs');
app.use(express.static('public')); 
app.use(express.urlencoded({extended:true})); 

http.createServer(app).listen(80);
https.createServer(options, app).listen(443, () => {
}); 

app.use("*", (req, res, next) => {
    if(req.secure){
        // --- https
        next();
    }else{
        // -- http
        return res.redirect("https://" + req.headers.host + req.url);
    }
})

// Content part

app.get("/about", (req, res) => {
    res.render('about');
})

app.get("/", (req, res) => {
    res.render('main', {});
})

app.post("/", (req, res) => {
    res.render('main', {code: req.body.search_input});
})

app.get('/images/:id', (req, res) => {
    const id = req.params.id;
    res.render('image', {code:id})
}); 

app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});