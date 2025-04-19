'use strict';

var express = require('express'),
    app = express(),
    http = require('http'),
    env = require('./.env.js');


app.set('views', __dirname + '/build');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
// app.use(require('prerender-redis-cache'));
app.use(require('prerender-node').set('prerenderServiceUrl', 'http://localhost:3000').set('protocol', 'https'));

app.use(express.static(__dirname + '/build'));

app.get('*', function(req, res) {
    res.render('index.html');
});

app.get('/robots.txt', function(req, res) {
    res.render('robots.txt');
});

//you may also need an error handler too (below), to serve a 404 perhaps?
app.use(function(err, req, res, next) {
    if ( ! err) {
        return next();
    }

    console.log('error: ' + err.stack);
    res.send(err.stack);
});

/**
 * Start server
 */
app.listen(env.node_port, function() {
    console.log('listening on port %d using %s ', env.node_port);
});
