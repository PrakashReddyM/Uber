const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        default: null
    },
    pickUpLocation: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number],
            required: true
        },
    },
    dropOffLocation: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number],
            required: true
        },
    },
    rideStatus: {
        type: String,
        enum: ['requested', 'accepted', 'in-progress', 'completed', 'cancelled'],
        default: 'requested'
    },
    motoFare: {
        type: Number,
    },
    tukFare: {
        type: Number,
    },
    carFare: {
        type: Number,
    },
    distance: {
        type: Number,
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card'],
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    vehicleType: {
        type: String,
        enum: ['Moto', 'tuktuk', 'car'],
    },
    estimatedTime: {
        type: Number
    },
    cancellationReason: {
        type: String
    },
    timeStamps: {
        requestedAt: {
            type: Date,
            default: Date.now
        },
        startedAt: {
            type: Date
        },
        endedAt: {
            type: Date
        }
    }
}, { timestamps: true })

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;




