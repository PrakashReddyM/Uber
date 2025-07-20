const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
const { sendToken } = require("../utils/sendToken");

//signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password, location } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please Enter Details' })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'User Already Exists' })
        }

        const hashPass = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashPass, currentLocation: location });
        if (!user) {
            return res.status(400).json({ message: 'Failed to Create User' })
        }

        sendToken(user, 201, res);
    } catch (error) {
        console.log('Error in SignUp controller:', error);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

//login
exports.login = async (req, res) => {
    try {
        const { email, password, location } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Invalid Email or Password' })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Create New Account!!' })
        }

        user.currentLocation = location;

        const matchPass = await bcrypt.compare(password, user.password);
        if (!matchPass) {
            return res.status(400).json({ message: 'Invalid Email or Password' })
        }

        sendToken(user, 200, res);
    } catch (error) {
        console.log('Error in Login controller:', error);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

//logout
exports.logout = async (req, res) => {
    try {
        res.status(200).cookie('token', '', { maxAge: 0 }).json({
            message: 'Loggod Out Successfully'
        })
    } catch (error) {
        console.log('Error in logout controller:', error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}