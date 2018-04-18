// ====================
// Express Setup
// ====================
const express = require('express');
const app = express();


// ====================
// More Imports
// ====================
const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({extended: true}));
const path = require('path');


// ====================
// Setup
// ====================
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 7000);
app.use(express.static(path.join(__dirname, 'public')));
// const credentials = require('./credentials.js');
// app.use(require('cookie-parser')(credentials.cookieSecret));


// ====================
// Routes
// ====================
app.get('/', (req, res) => {
	res.render('index');
})

app.get('/projects', (req, res) => {
	res.render('projects');
})

app.get('/projects/:project', (req, res) => {
	res.send(req.params.project);
})

app.get('*', (req, res) => {
	res.status(404);
	res.send('404: Page not found');
})


// ====================
// Port Listening
// ====================
app.listen(app.get('port'), () => {
	console.log('Express started on http://localhost:' + app.get('port'));
})