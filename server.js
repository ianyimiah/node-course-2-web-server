const express = require ('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(`${__dirname }/views/partials`);
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}:    ${req.method} ${req.url}`
    
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err) {
            console.log('Unable to append to server.log.')
        }
    });
    next();
});

var maintenanceMode = false;
app.use((req, res, next) => {
    if (maintenanceMode) {
        res.render('maintenance', {pageTitle: 'Maintenance'});
    }
    else {
        next();
    }
});

app.use(express.static(`${__dirname}/public`));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();    
});

hbs.registerHelper('screamit', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    // res.send(`<h1>Hello Express<h1>`);
    res.render('home', {
        pageTitle: 'Home',
        welcomeMessage: 'Welcome to my world'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errMessage: ' '
    });
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});