const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false
    },
    vehicleType: {
        type: String,
        enum: ['car', 'Moto', 'auto'],
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 5.0,
        min: 1,
        max: 5
    },
    availability: {
        type: Boolean,
        default: false
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number],
            required: true
        },
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'on-trip', 'off-duty'],
        default: 'active'
    },
}, { timestamps: true });

driverSchema.index({ location: '2dsphere' });

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
