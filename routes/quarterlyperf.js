const express = require('express');
const router = express.Router();

router.use("*", (req, res, next) => {
    res.locals.meta = {
        ogTitle: 'Quarterly Performances', 
        ogDesc: 'Review and analyze quarterly performances!', 
        ogImage: '/images/thumbnail_quarterlyperf.png', 
    };
    next();
}); 

const sqlite3 = require('sqlite3').verbose();

router.get("/about", (req, res) => {
    res.render('quarterlyperf/about');
});

router.get("/", (req, res) => {
    res.render('quarterlyperf/main', {});
});

router.post("/", (req, res) => {
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
        res.render('quarterlyperf/main', { rows });
    });
    db.close()
}); 

router.get('/images/:id', (req, res) => {
    const id = req.params.id;
    res.render('quarterlyperf/image', {code:id})
}); 


router.use((req, res) => {
    res.status(404).render('quarterlyperf/404', { title: '404' });
});

module.exports = router;