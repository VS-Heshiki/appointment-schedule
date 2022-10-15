const appointment = require('../models/Appointment');
const appoFactory = require('../factory/AppointmentFactory');
const mongoose = require('mongoose');
const mailer = require('nodemailer');

const appo = mongoose.model('Appointment', appointment);

class AppointmentServices {
	async Create(name, email, cpf, phone, type, date, time) {
		let newAppo = new appo({
			name,
			email,
			cpf,
			phone,
			type,
			date,
			time,
			finished: false,
			notified: false,
		});

		try {
			await newAppo.save();
			return true;
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	async ShowAll(status) {
		if (status) {
			return await appo.find();
		} else {
			let Appo = await appo.find({ finished: false });
			let appos = [];

			Appo.forEach(appointment => {
				if (appointment.date != undefined) {
					appos.push(appoFactory.Build(appointment));
				}
			});

			return appos;
		}
	}

	async FindById(id) {
		try {
			const search = await appo.findOne({ _id: id });
			
			return search;
		} catch (err) {
			console.log(err);
		}
	}

	async Edit(id, name, email, cpf, phone, type, date, time) {
		if (name != appo.name) {
			if (name != undefined || name != '') {
				appo.name == name;
			} else {
				return false;
			}
		}

		if (email != appo.email) {
			if (email != undefined || email != '') {
				appo.email == email;
			} else {
				return false;
			}
		}

		if (cpf != appo.cpf) {
			if (cpf != undefined || cpf != '') {
				appo.cpf == cpf;
			} else {
				return false;
			}
		}

		if (phone != appo.phone) {
			if (phone != undefined || phone != '') {
				appo.phone == phone;
			} else {
				return false;
			}
		}

		if (type != appo.type) {
			if (type != undefined || type != '') {
				appo.type == type;
			} else {
				return false;
			}
		}

		if (date != appo.date) {
			if (date != undefined || date != '') {
				appo.date == date;
			} else {
				return false;
			}
		}

		if (time != appo.time) {
			if (time != undefined || time != '') {
				appo.time == time;
			} else {
				return false;
			}
		}

		try {
			await appo.findByIdAndUpdate(id, {
				name: name,
				email: email,
				cpf: cpf,
				phone: phone,
				type: type,
				date: date,
				time: time,
			});
			return true;
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	async Finish(id) {
		try {
			await appo.findByIdAndUpdate(id, { finished: true });
			return true;
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	async Search(query) {
		try {
			const result = await appo
				.find()
				.or([{ cpf: query }, { name: query }]);
			return result;
		} catch (err) {
			console.log(err);
			return [];
		}
	}

	async EmailSender() {
		const appos = await this.ShowAll(false);

		let transporter = mailer.createTransport({
			host: '*************',
			port: 999,
			auth: {
				user: '**************',
				pass: '**************',
			},
		});

		appos.forEach(async app => {
			let date = app.start.getTime();
			let hour = 1000 * 60 * 60;
			let gap = date - Date.now();

			if (gap <= hour) {
				if (!app.notified) {
					await appo.findByIdAndUpdate(app.id, { notified: true });

					transporter.sendMail({
							from: '********** <************>',
							to: app.email,
							subject: 'Your appointment schedule is comming soon!',
							text: 'Hi, we would like to let you know that your appointment will be soon!',
						})
						.then(() => {
							console.log('Your email has been sent!');
						})
						.catch(err => {
							console.log(err);
						});
				}
			}
		});
	}
}

module.exports = new AppointmentServices();
