const express = require('express');
const http = require('http');
const fs = require('fs');
const app = express();

const quarterlyperfRoutes = require('./routes/quarterlyperf');
const tnpartnersRoutes = require('./routes/tnpartners');

app.set('view engine', 'ejs');
app.use(express.static('public'));  
app.use(express.urlencoded({extended:true})); 

http.createServer(app).listen(3000);

// Load specific routes based on domain
app.use((req, res, next) => {
    const host = req.headers.host;
    if (host.includes("quarterlyperf.local")) {
        app.use("/", quarterlyperfRoutes);
    } else if (host.includes("tnpartners.local")) {
        app.use("/", tnpartnersRoutes);
    } else {
        res.status(404).render('404', { title: '404' });
    }
    next();
});