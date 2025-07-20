const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const connectDB = require('./database/db')
const cors = require('cors')

const userR = require('./routes/userRoute')
const rideR = require('./routes/rideRoute')
const driverR = require('./routes/driveRoute')

//config
dotenv.config({})

connectDB();

const app = express()
const port = process.env.PORT = 2025;

//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use('/api/auth', userR);
app.use('/api/ride', rideR);
app.use('/api/driver', driverR);

app.listen(port, () => {
    console.log(`server running on port: http://localhost:${port}`)
})