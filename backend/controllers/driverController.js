const Driver = require("../models/driverModel");
const bcrypt = require('bcryptjs');
const { sendToken } = require("../utils/sendToken");

// Create Driver
exports.createDriver = async (req, res) => {
    try {
        const { name, email, password, vehicleType, vehicleNumber, location } = req.body;
        if (!name || !email || !password || !vehicleType || !vehicleNumber || !location) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        const existingDriver = await Driver.findOne({ email });
        if (existingDriver) {
            return res.status(400).json({ message: 'Driver with this email already exists.' });
        }
        const hashPass = await bcrypt.hash(password, 10);

        const driver = await Driver.create({ name, email, password: hashPass, vehicleType, vehicleNumber, location });
        if (!driver) { return res.status(400).json({ message: 'Failed to create driver.' }) }

        sendToken(driver, 201, res);
    } catch (error) {
        console.error('Error in create driver controller:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Driver Login
exports.driverLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const driver = await Driver.findOne({ email }).select('+password');
        if (!driver) {
            return res.status(400).json({ message: 'Account not found. Please register first.' });
        }

        const matchPass = await bcrypt.compare(password, driver.password);
        if (!matchPass) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        sendToken(driver, 200, res);
    } catch (error) {
        console.error('Error in driver login controller:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Driver logout
exports.driverLogout = async (req, res) => {
    try {
        res.status(200).cookie('token', '', { maxAge: 0 }).json({
            message: 'Loggod Out Successfully'
        })
    } catch (error) {
        console.log('Error in driver logout controller:', error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

