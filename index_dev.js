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
    res.setHeader('Cache-Control', 'no-store'); // Disable caching
    const host = req.headers.host;
    // Load specific routes based on domain
    if (host.includes("quarterlyperf.local")) {
        res.locals.routeMessage = 'quarterly perf connected'; // expressed in footer.ejs
        return quarterlyperfRoutes(req, res, next); // Call the routes directly
    } else if (host.includes("tnpartners.local")) {
        res.locals.routeMessage = 'tnpartners connected'; // expressed in footer.ejs
        return tnpartnersRoutes(req, res, next); // Call the routes directly
    } else {
        return res.status(404).render('404', { title: '404' });
    }
});