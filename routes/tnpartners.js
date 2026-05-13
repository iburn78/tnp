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

router.use((req, res) => {
    res.status(404).render('tnpartners/404', { title: '404' });
});

module.exports = router;
