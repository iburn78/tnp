const express = require('express');
const http = require('http');

const app = express();
app.set('view engine', 'ejs');
http.createServer(app).listen(3000);


app.get("/", (req, res) => {
    const buldogs = [
        {a: 1, b: 2},
        {c: 1, d: 2},
        {e: 1, f: 2},
    ]
    console.log(req.url, req.method);
    res.render('temp', {buldogs})
})
