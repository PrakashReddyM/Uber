const User = require("../models/userModel");
const jwt = require('jsonwebtoken')

exports.sendToken = async (user, statusCode, res) => {
    try {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' })
        const options = {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        }
        const userObj = user.toObject();
        delete userObj.password;

        res.status(statusCode).cookie('token', token, options).json(userObj);
    } catch (error) {
        console.log('Error in sendToken Controller:', error);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}