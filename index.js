const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const appointmentServices = require('./services/AppointmentServices');
const moment = require('moment');

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
	.connect('mongodb://localhost:27017/scheduling')
	.then(() => {
		console.log('mongodb connection established');
	})
	.catch(err => {
		console.log(err);
	});

app.get('/', async (req, res) => {
	let appointments = await appointmentServices.ShowAll(false);
	res.render('index', { appointments });
});

app.get('/appos', async (req, res) => {
	let appointments = await appointmentServices.ShowAll(false);
	res.json(appointments);
});

app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/create', async (req, res) => {
	let { name, email, cpf, phone, type, date, time } = req.body;
	let status = await appointmentServices.Create(
		name,
		email,
		cpf,
		phone,
		type,
		date,
		time
	);

	if (status) {
		res.redirect('/');
	} else {
		res.redirect('/register');
	}
});

app.get('/edit/:id', async (req, res) => {
	let result = await appointmentServices.FindById(req.params.id);
	let newDate = moment(result.start).utc().format('YYYY-MM-DD');

	if (result != undefined) {
		res.render('edit', { result, newDate });
	} else {
		res.render('err');
	}
});

app.post('/edited', async (req, res) => {
	let { id, name, email, cpf, phone, type, date, time } = req.body;
	let edited = await appointmentServices.Edit(
		id,
		name,
		email,
		cpf,
		phone,
		type,
		date,
		time
	);

	if (edited != false) {
		res.redirect('/');
	} else {
		res.render('err');
	}
});

app.post('/finished', async (req, res) => {
	let finished = await appointmentServices.Finish(req.body.id);

	if (finished) {
		res.redirect('/');
	} else {
		res.render('err');
	}
});

app.get('/listAll', async (req, res) => {
	let list = await appointmentServices.ShowAll(true);
	res.render('list', { list });
});

app.get('/search', async (req, res) => {
	let list = await appointmentServices.Search(req.query.search);
	res.render('list', { list });
});

setInterval(async () => {
	await appointmentServices.EmailSender();
}, 30000);

app.listen(9999, (req, res) => {
	console.log('listening on port 9999');
});
