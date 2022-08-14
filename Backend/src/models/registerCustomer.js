const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
    FullName: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true,
    },
    ConfirmPassword: {
        type: String,
        required: true,
    },

    PhoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    Address: {
        type: String,
        required: true,
    },
    City: {
        type: String,
        required: true,
    },
    AdhaarNumber: {
        type: Number,
        required: true,
        unique: true
    },


})



const RegisterCustomer = new mongoose.model("RegisterCustomer", customerSchema);

module.exports = RegisterCustomer;