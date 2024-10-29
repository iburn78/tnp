const express = require('express');
const http = require('http');
const fs = require('fs');
const app = express();

http.createServer(app).listen(3000);
app.set('view engine', 'ejs');
app.use(express.static('public'));  
app.use(express.urlencoded({extended:true})); 

app.use("*", (req, res, next) => { 
    const host = req.headers.host;
    const ogTitle = (host === 'tnpartners.net' || host === 'www.tnpartners.net') 
        ? 'TN Partners' 
        : 'Quarterly Performances';
    res.locals.meta = {
        ogTitle: ogTitle, 
        ogDesc: 'Review and analyze quarterly performances!', 
        ogImage: '/images/thumbnail_issuetracker.jpg', 
    };
    next();
});

// ---------------------------------------
// Content part ==========================
// ---------------------------------------

const sqlite3 = require('sqlite3').verbose();

app.get("/about", (req, res) => {
    res.render('about');
});

app.get("/", (req, res) => {
    const host = req.headers.host;
    // might do actions depending on the host
    res.render('main', {});
});

app.post("/", (req, res) => {
    const db = new sqlite3.Database('public/data/df_krx.db');
    const keyword = req.body.search_input; // || 'keyword';
    const tableName = 'krx_data'
    const query = `
    SELECT * 
    FROM ${tableName}
    WHERE Name LIKE '%${keyword}%' OR Code LIKE '%${keyword}%'
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.render('main', { rows });
    });
    db.close()
}); 

app.get('/images/:id', (req, res) => {
    const id = req.params.id;
    res.render('image', {code:id})
}); 

app.get("/andy_d", (req, res) => {
    const filePath = 'public/andy/daily_update.json'
    
    // Read the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            res.status(500).send("Error loading data.");
        } else {
            const jsonData = JSON.parse(data);
            // Pass jsonData to the EJS template
            res.render('daily_update', { report: jsonData });
        }
    });
});

app.get("/andy_p", (req, res) => {
    const filePath = 'public/andy/periodic_update.json'
    
    // Read the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            res.status(500).send("Error loading data.");
        } else {
            const jsonData = JSON.parse(data);
            // Pass jsonData to the EJS template
            res.render('periodic_update', { report: jsonData });
        }
    });
});

app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});