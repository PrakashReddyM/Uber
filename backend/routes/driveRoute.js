const express = require('express');
const { createDriver, driverLogin, driverLogout } = require('../controllers/driverController');
const { protectDRoute } = require('../middlewares/dauth');
const { getRides, acceptRide } = require('../controllers/rideController');
const router = express.Router()

router.route('/create').post(createDriver);
router.route('/login').post(driverLogin)
router.route('/logout').get(driverLogout)

router.route('/rides').get(protectDRoute,getRides)
router.route('/ride/:id').put(protectDRoute,acceptRide);

module.exports = router;