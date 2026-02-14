const express = require('express');
const app1 = express();
const app2 = express();

const quarterlyperfRoutes = require('./routes/quarterlyperf');
const tnpartnersRoutes = require('./routes/tnpartners');

// === QUARTERLY PERF (PORT 3000) ===
app1.set('view engine', 'ejs');
app1.use(express.static('public'));
app1.use(express.urlencoded({ extended: true }));

// Add routeMessage for footer.ejs
app1.use((req, res, next) => {
    res.locals.routeMessage = 'quarterly perf connected';
    next();
});

// Mount quarterlyperf routes
app1.use(quarterlyperfRoutes);

app1.listen(3000, () => {
    console.log('QuarterlyPerf running on port 3000');
});

// === TN PARTNERS (PORT 4000) ===
app2.set('view engine', 'ejs');
app2.use(express.static('public'));
app2.use(express.urlencoded({ extended: true }));

// Add routeMessage for footer.ejs
app2.use((req, res, next) => {
    res.locals.routeMessage = 'tnpartners connected';
    next();
});

// Mount tnpartners routes
app2.use(tnpartnersRoutes);

app2.listen(4000, () => {
    console.log('TNPartners running on port 4000');
});

