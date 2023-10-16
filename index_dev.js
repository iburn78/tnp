const express = require('express');
const http = require('http');
const path = require("path")

const app = express();
http.createServer(app).listen(3000);

app.set('view engine', 'ejs');
app.use(express.static('public')); 
app.use(express.urlencoded({extended:true})); 


app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap-icons')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

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