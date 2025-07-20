import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TbSquareDotFilled } from "react-icons/tb";
import { FaDotCircle } from "react-icons/fa";
import moto from "../assets/moto.png";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import axios from "axios";
import { BaseUrl } from "../utils/api";
import { useAuth } from "../context/AuthContext";

// Configure Leaflet Icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CapHome = () => {
    const { dauthUser } = useAuth();
    const [rides, setRides] = useState([]);
    const [currentRide, setCurrentRide] = useState(null);
    const rideIndex = useRef(0);
    const navigate = useNavigate();

    // Fetch rides when component mounts
    useEffect(() => {
        const fetchRides = async () => {
            try {
                const { data } = await axios.get(`${BaseUrl}/driver/rides`, { withCredentials: true });
                setRides(data);
            } catch (error) {
                console.error("Error fetching rides:", error.message);
            }
        };

        fetchRides();
    }, []);

    // Cycle through rides every 10 seconds
    useEffect(() => {
        if (rides.length === 0) return;

        const updateRide = async () => {
            const ride = rides[rideIndex.current];

            try {
                const [pickUpName, dropOffName] = await Promise.all([
                    getPlaceName(ride.pickUpLocation.coordinates),
                    getPlaceName(ride.dropOffLocation.coordinates),
                ]);

                setCurrentRide({ ...ride, pickUpName, dropOffName });
            } catch (error) {
                console.error("Error updating ride:", error);
            }

            // Increment index (loop back to 0 if it exceeds ride count)
            rideIndex.current = (rideIndex.current + 1) % rides.length;
        };

        updateRide();
        const interval = setInterval(updateRide, 10000);

        return () => clearInterval(interval);
    }, [rides]);

    // Get place name using reverse geocoding
    const getPlaceName = async ([lat, lng]) => {
        try {
            const { data } = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            return data.address?.suburb || data.address?.city || "Unknown Location";
        } catch (error) {
            console.error("Error fetching place name:", error.message);
            return "Unknown Location";
        }
    };

    // Accept Ride Handler
    // ...existing code...
    const handleAccept = async (e) => {
        e.preventDefault();
        if (!currentRide) return;

        try {
            const { data } = await axios.put(`${BaseUrl}/ride/${currentRide._id}/accept`, { withCredentials: true });
            console.log("Ride Accepted:", data);
        } catch (error) {
            console.error("Error accepting ride:", error.message);
        }
    };
    // ...existing code...

    // Show loading state if no current ride is available
    if (!currentRide)
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner" aria-label="Loading rides..." />
            </div>
        );

    return (
        <div className="flex flex-col md:flex-row w-full justify-evenly mt-10 items-center">
            {/* Ride Request Box */}
            <div className="w-full max-w-sm shadow-lg rounded-lg bg-white p-6 flex flex-col justify-between">
                <p className="font-bold text-lg text-gray-900">Ride Request</p>
                <div className="flex justify-center items-center mt-4">
                    <img src={moto} alt="Vehicle" className="w-40 h-auto" />
                </div>
                <div className="mt-6 flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        <FaDotCircle />
                        <p className="text-gray-700 font-medium">{currentRide.pickUpName}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <TbSquareDotFilled className="text-red-500" />
                        <p className="text-gray-700 font-medium">{currentRide.dropOffName}</p>
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-gray-600 font-semibold">Distance: {currentRide.distance} Kms</p>
                    <p className="text-sm text-gray-600 mt-2 font-semibold">
                        Passenger: {currentRide.user?.name || "Unknown"}
                    </p>
                </div>
                <div className="flex gap-4 mt-6">
                    <button
                        className="w-full py-2 bg-red-100 text-red-600 font-medium rounded-lg hover:bg-red-200"
                        onClick={() => navigate("/")}
                    >
                        Cancel
                    </button>
                    <button
                        className="w-full py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700"
                        onClick={handleAccept}
                    >
                        Accept
                    </button>
                </div>
            </div>

            {/* Map Display */}
            <div className="w-full md:w-[700px] h-[450px] mt-10 md:mt-0 rounded-lg overflow-hidden shadow-md">
                <MapContainer
                    center={[
                        currentRide.pickUpLocation.coordinates[0] || 0,
                        currentRide.pickUpLocation.coordinates[1] || 0,
                    ]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {/* Pick-up Marker */}
                    <Marker position={[currentRide.pickUpLocation.coordinates[0], currentRide.pickUpLocation.coordinates[1]]}>
                        <Popup>Pick-up Location</Popup>
                    </Marker>

                    {/* Drop-off Marker */}
                    <Marker position={[currentRide.dropOffLocation.coordinates[0], currentRide.dropOffLocation.coordinates[1]]}>
                        <Popup>Drop-off Location</Popup>
                    </Marker>

                    {/* Polyline from Pick-up to Drop-off */}
                    <Polyline
                        positions={[
                            [currentRide.pickUpLocation.coordinates[0], currentRide.pickUpLocation.coordinates[1]],
                            [currentRide.dropOffLocation.coordinates[0], currentRide.dropOffLocation.coordinates[1]],
                        ]}
                        color="black"
                    />
                </MapContainer>
            </div>
        </div>
    );
};

export default CapHome;
