const express = require('express');
const { requestRide, getDrivers, getTrips, updateRequest, getRideDetails, acceptRide } = require('../controllers/rideController');
const { protectRoute } = require('../middlewares/auth');
const { protectDRoute } = require('../middlewares/dauth');
const router = express.Router()

router.route('/request').post(protectRoute, requestRide)
router.route('/request/:id').put(protectRoute, updateRequest)
router.route('/drivers').get(protectRoute, getDrivers)
router.route('/ride-details/:id').get(protectRoute, getRideDetails);
router.route('/:id/accept').put(protectDRoute, acceptRide);

module.exports = router;