const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
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
    PinCode: {
        type: Number,
        required: true
    },
    KhasraNumber: {
        type: Number,
        required: true,
        unique: true
    }

})



const RegisterFarmer = new mongoose.model("RegisterFarmer", FarmerSchema);

module.exports = RegisterFarmer;