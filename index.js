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


// ---------------------------------------
// Content part ==========================
// ---------------------------------------

const sqlite3 = require('sqlite3').verbose();

app.get("/about", (req, res) => {
    res.render('about');
});

app.get("/", (req, res) => {
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
