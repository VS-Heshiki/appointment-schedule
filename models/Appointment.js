const mongoose = require("mongoose");

const appointment = new mongoose.Schema({
    name: String,
    email: String,
    cpf: String,
    phone: String,
    type: String,
    date: Date,
    time: String,
    finished: Boolean,
    notified: Boolean,
})

module.exports = appointment;