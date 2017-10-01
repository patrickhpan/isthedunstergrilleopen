// Configure password from .env file and state to closed
require('dotenv').config();
const { PASSWORD, PORT } = process.env;
let isOpen = false;

// Import modules
const express = require('express');
const bp = require('body-parser');
const morgan = require('morgan');

const OPEN = __dirname + '/open.html',
    CLOSED = __dirname + '/closed.html',
    ADMIN = __dirname + '/admin.html',
    STATIC = __dirname + '/static';

// Initialize express with body parser and logging
const app = express();
app.use(bp.urlencoded({ extended: true }));
app.use(morgan('common'));

// Send index.html at /
app.get('/', (req, res) => res.sendFile(
    isOpen === true ?
        OPEN :
        CLOSED
));

// Send admin.html at /admin
app.get('/admin', (req, res) => res.sendFile(ADMIN));

app.post('/status', (req, res) => {
    const { password, open } = req.body;
    if (password !== PASSWORD) {
        console.log(`Failed login attempt: given password "${password}", actual password "${PASSWORD}"`)
        res.redirect('/admin?fail=true')        
        return;
    } 
    isOpen = ( open === true || open === 'true' );
    res.redirect('/');
})

app.use(express.static(STATIC));

// If all else fails, redirect to home page
app.use('*', (req, res) => { res.redirect('/') });

// Start app!
app.listen(PORT || 8080)
