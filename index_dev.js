const express = require('express');
const http = require('http');
const path = require("path");
const app = express();

http.createServer(app).listen(3000);
app.set('view engine', 'ejs');
app.use(express.static('public'));  
app.use(express.urlencoded({extended:true})); 

app.use("*", (req, res, next) => { 
    next();
});

// Content part

app.get("/about", (req, res) => {
    res.render('about');
});

app.get("/", (req, res) => {
    res.render('main', {});
});

app.post("/", (req, res) => {
    res.render('main', {code: req.body.search_input});
}); 

app.get('/images/:id', (req, res) => {
    const id = req.params.id;
    res.render('image', {code:id})
}); 

app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});