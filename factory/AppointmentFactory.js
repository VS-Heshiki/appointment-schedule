const moment = require('moment');

class AppointmentFactory {
	Build(rawAppo) {
		let day = rawAppo.date.getDate() + 1;
		let month = rawAppo.date.getMonth();
		let year = rawAppo.date.getFullYear();
		let hour = Number.parseInt(rawAppo.time.split(':')[0]);
		let minute = Number.parseInt(rawAppo.time.split(':')[1]);


		let date = new Date(year, month, day, hour, minute);

		let appo = {
			id: rawAppo._id,
			title: rawAppo.name + ' - ' + rawAppo.type,
			start: date,
			end: date,
			notified: rawAppo.notified,
			email: rawAppo.email,
			newDate: moment(rawAppo.start).utc().format('DD/MM/YYYY'),
			time: rawAppo.time
		};

		return appo;
	}
}

module.exports = new AppointmentFactory();
