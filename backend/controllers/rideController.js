const Ride = require("../models/rideModel");
const Driver = require('../models/driverModel')

//request Ride
exports.requestRide = async (req, res) => {
    try {
        const user = req.user;
        const { pickUpLocation, dropOffLocation, distance, motoFare, tukFare, carFare, paymentMethod } = req.body;

        const ride = await Ride.create({
            user,
            pickUpLocation,
            dropOffLocation,
            distance,
            motoFare,
            tukFare,
            carFare,
            paymentMethod,
            estimatedTime: distance * 10
        });
        if (!ride) {
            return res.status(400).json({ message: 'Failed to Create Ride' })
        }

        res.status(201).json({
            success: true,
            ride
        })
    } catch (error) {
        console.log('Error in request Ride controller:', error);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

//update request
exports.updateRequest = async (req, res) => {
    try {
        const ride = await Ride.findByIdAndUpdate(req.params.id, req.body);
        if (!ride) {
            return res.status(400).json({ message: 'Ride Request Not Found' })
        }
        res.status(200).json({ success: true, ride })
    } catch (error) {
        console.log('Error in update Request controller:', error);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

//get drivers
exports.getDrivers = async (req, res) => {
    try {
        const all_drivers = await Driver.find();
        res.status(200).json(all_drivers);
    } catch (error) {
        console.log('Error in get drivers controller:', error);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

//get rides
exports.getRides = async (req, res) => {
    try {
        const rides = await Ride.find().populate('user')
        res.status(200).json(rides);
    } catch (error) {
        console.log('Error in get Rides controller:', error);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

//accept ride
exports.acceptRide = async (req, res) => {
    try {
        const rideId = req.params.id;
        const user = req.user;
        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ success: false, message: 'Ride Not Found' });
        }
        if (ride.status === 'accepted') {
            return res.status(400).json({ success: false, message: 'Ride is already accepted' });
        }
        ride.driver = user;
        ride.rideStatus = 'accepted';
        await ride.save();
        res.status(200).json({ success: true, message: 'Accepted the Ride', ride });
    } catch (error) {
        console.error('Error in acceptRide controller:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};


exports.getRideDetails = async (req, res) => {
    try {
        const rideId = req.params.id;

        const ride = await Ride.findById(rideId)
            .populate('driver', 'name email')
        if (!ride) {
            return res.status(404).json({ success: false, message: 'Ride not found' });
        }

        res.status(200).json({ success: true, ride });
    } catch (error) {
        console.error('Error fetching ride details:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

