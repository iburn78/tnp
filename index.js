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

const quarterlyperfRoutes = require('./routes/quarterlyperf');
const tnpartnersRoutes = require('./routes/tnpartners');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

http.createServer(app).listen(80);
https.createServer(options, app).listen(443);

app.use("*", (req, res, next) => {
    const host = req.headers.host;
    // Redirect to HTTPS if request is not secure
    if (!req.secure) {
        return res.redirect("https://" + host + req.url);
    }
    next();
});

// Load specific routes based on domain
app.use((req, res, next) => {
    const host = req.headers.host;
    if (host.includes("quarterlyperf.com")) {
        res.locals.routeMessage = 'quarterly perf entered';
        app.use("/", quarterlyperfRoutes);
    } else if (host.includes("tnpartners.net")) {
        res.locals.routeMessage = 'tnpartners entered';
        app.use("/", tnpartnersRoutes);
    } else {
        res.status(404).render('404', { title: '404' });
    }
    next();
});

