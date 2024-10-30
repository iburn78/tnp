const express = require('express');
const router = express.Router();
const fs = require('fs');

router.use("*", (req, res, next) => {
    res.locals.meta = {
        ogTitle: 'TN Partners', 
        ogDesc: 'A Private Equity Firm in Seoul, Korea.', 
        ogImage: '/images/thumbnail_tnpartners.png', 
    };
    next();
});

router.get("/", (req, res) => {
    res.render('tnpartners/main', {timestamp: Date.now()});
});

router.get("/about", (req, res) => {
    res.render('tnpartners/about');
});


router.get("/andy_d", (req, res) => {
    const filePath = 'public/andy/daily_update.json'
    
    // Read the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            res.status(500).send("Error loading data.");
        } else {
            const jsonData = JSON.parse(data);
            // Pass jsonData to the EJS template
            res.render('tnpartners/daily_update', { report: jsonData });
        }
    });
});

router.get("/andy_p", (req, res) => {
    const filePath = 'public/andy/periodic_update.json'
    
    // Read the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            res.status(500).send("Error loading data.");
        } else {
            const jsonData = JSON.parse(data);
            // Pass jsonData to the EJS template
            res.render('tnpartners/periodic_update', { report: jsonData });
        }
    });
});

router.use((req, res) => {
    res.status(404).render('tnpartners/404', { title: '404' });
});

module.exports = router;
