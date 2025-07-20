import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { TbSquareDotFilled } from "react-icons/tb";
import { FaDotCircle } from "react-icons/fa";
import { PiMapPinSimpleFill } from "react-icons/pi";
import { RiMapPinRangeFill } from "react-icons/ri";
import { BaseUrl } from '../utils/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import moto from '../assets/moto.png';
import tuk from '../assets/tuktuk.png';
import car from '../assets/car.png';
import { MdDiscount } from "react-icons/md";
import { useNavigate } from 'react-router-dom'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Home = () => {
  const { authUser } = useAuth();
  const [longitude, latitude] = authUser?.currentLocation?.coordinates || [78.475166, 17.361719];
  const [pickupLocation, setPickupLocation] = useState([latitude, longitude]);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [pickupInput, setPickupInput] = useState('');
  const [dropoffInput, setDropoffInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [info, setInfo] = useState({})
  const [pay, setPay] = useState('')
  const [vehicle, setVehicle] = useState('')
  const navigate = useNavigate()

  const fetchCoordinates = async (location) => {
    const endpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&addressdetails=1&limit=1`;
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      if (data && data[0]) {
        const { lat, lon } = data[0];
        return [parseFloat(lat), parseFloat(lon)];
      } else {
        console.error('No results found for this location.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };

  const toRad = (deg) => deg * (Math.PI / 180);
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.ceil(distance);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!pickupInput || !dropoffInput) {
      setError('Please provide both pickup and dropoff locations.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const [pickupCoords, dropoffCoords] = await Promise.all([
        fetchCoordinates(pickupInput),
        fetchCoordinates(dropoffInput),
      ]);
      setPickupLocation(pickupCoords);
      setDropoffLocation(dropoffCoords);
      const distanceVal = haversineDistance(pickupCoords[0], pickupCoords[1], dropoffCoords[0], dropoffCoords[1]);


      if (pickupCoords && dropoffCoords) {
        try {
          const { data } = await axios.post(
            `${BaseUrl}/ride/request`,
            {
              pickUpLocation: { coordinates: pickupCoords }, dropOffLocation: { coordinates: dropoffCoords },
              distance: distanceVal, motoFare: 10 * distanceVal, tukFare: 16 * distanceVal, carFare: 20 * distanceVal
            }, { withCredentials: true }
          );
          setInfo(data.ride);
          setSearchCompleted(true);
        } catch (error) {
          navigate('/login')
        }
      } else {
        setError('Invalid location. Please try again.');
      }
    } catch (error) {
      console.error('Error during Ride Creation:', error);
      setError('Please check pickup and dropoff locations.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!vehicle || !pay) {
        setError('Please select Ride-Type and Payment Method.');
        return;
      }
      await axios.put(`${BaseUrl}/ride/request/${info._id}`, { paymentMethod: pay, vehicleType: vehicle }, { withCredentials: true });
      navigate('/ride', { state: { info, vehicle, pay, pickupInput, dropoffInput } });
    } catch (error) {
      console.error('Error during Ride Creation:', error);
      setError('An error occurred while processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex w-full justify-evenly mt-10 items-center">
      {!searchCompleted ? (
        <div className="w-full max-w-sm h-[360px] shadow-xl rounded-md p-10">
          <p className="text-xl text-gray-700 font-mono font-semibold mb-6">Get a Ride</p>
          <form onSubmit={handleSearch} className="space-y-5">
            <div className="flex items-center rounded-sm px-3 bg-zinc-100">
              <FaDotCircle />
              <input
                type="text"
                placeholder="Pickup Location"
                value={pickupInput}
                onChange={(e) => setPickupInput(e.target.value)}
                className="w-full p-2 border-none bg-zinc-100 rounded outline-none"
              />
            </div>
            <div className="flex items-center rounded-sm px-3 bg-zinc-100">
              <TbSquareDotFilled />
              <input
                type="text"
                placeholder="Dropoff Location"
                value={dropoffInput}
                onChange={(e) => setDropoffInput(e.target.value)}
                className="w-full p-2 border-none bg-zinc-100 rounded outline-none"
              />
            </div>
            <div className="flex items-center space-x-2">
              <p className='flex items-center gap-1 text-[14px] text-gray-400 font-semibold bg-zinc-100 px-2 py-1 rounded-md'>For me <MdOutlineKeyboardArrowDown /></p>
            </div>
            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700"
            >
              Search
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-sm min-h-[470px] shadow-xl rounded-md p-10 px-4 pt-0">
          <p className="font-bold text-[24px] text-gray-800">Choose a Ride</p>
          <div className='my-4'>
            <div className="flex items-center gap-3  px-2">
              <span className='font-semibold text-gray-700'>{pickupInput} </span> <span><FaArrowRightLong /></span> <span className='font-semibold text-gray-700'>{dropoffInput}</span>
            </div>
            <div className='flex gap-2 mt-1 text-xs font-semibold text-gray-600 pl-2'>
              <p>{info.distance}Kms,</p>
              <p>{info.estimatedTime} mins</p>
            </div>
          </div>

          <p className="font-bold text-[20px] text-gray-800">Recommended</p>
          <div className="space-y-6 mt-4">
            <div className="space-y-6 mt-4">
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              {/* Moto Option */}
              <div onClick={() => setVehicle('Moto')}
                className={`flex items-center space-x-4 cursor-pointer p-2 rounded-lg ${vehicle === 'Moto' ? 'border-2 border-gray-800' : 'border'
                  }`} >
                <img src={moto} alt="moto" className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="font-semibold">Moto</p>
                  <p className="text-sm text-gray-500">Affordable, motorcycle rides</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-500 flex items-center">
                    <MdDiscount className="text-green-500" />50% off
                  </p>
                  <p className="text-lg font-semibold">₹{info.motoFare}/-</p>
                </div>
              </div>

              {/* TukTuk Option */}
              <div onClick={() => setVehicle('Tuk')}
                className={`flex items-center space-x-4 cursor-pointer p-2 rounded-lg ${vehicle === 'Tuk' ? 'border-2 border-gray-800' : 'border'
                  }`} >
                <img src={tuk} alt="tuk" className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="font-semibold">Uber Auto</p>
                  <p className="text-sm text-gray-500">No bargaining, doorstep pickup</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-500 flex items-center">
                    <MdDiscount className="text-green-500" />50% off
                  </p>
                  <p className="text-lg font-semibold">₹{info.tukFare}/-</p>
                </div>
              </div>

              {/* Car Option */}
              <div
                onClick={() => setVehicle('Car')}
                className={`flex items-center space-x-4 cursor-pointer p-2 rounded-lg ${vehicle === 'Car' ? 'border-2 border-gray-800' : 'border'
                  }`}
              >
                <img src={car} alt="car" className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="font-semibold">Uber Go</p>
                  <p className="text-sm text-gray-500">Affordable, compact rides</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-500 flex items-center">
                    <MdDiscount className="text-green-500" />50% off
                  </p>
                  <p className="text-lg font-semibold">₹{info.carFare}/-</p>
                </div>
              </div>
            </div>

          </div>

          <div className="flex justify-between mt-6">
            <div className="flex flex-col space-y-2">
              <select
                name="payment-method"
                id="payment-method"
                className="px-2 py-2 bg-white outline-none font-semibold text-gray-700 items-center"
                onChange={(e) => setPay(e.target.value)}
                value={pay}
              >
                <option value="" disabled className="text-gray-500 font-semibold">Payment Method</option>
                <option value="Card" className="font-semibold">Card</option>
                <option value="Cash" className="font-semibold">Cash</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                onClick={handleRequest}
                className="w-full bg-gray-800 text-white p-2 py-1.5 rounded-sm hover:bg-black-700 transition duration-200"
              >
                Request Ride
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-[700px] h-[450px] mt-6">
        <MapContainer center={pickupLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={pickupLocation} >
            <Popup>Pickup Location</Popup>
          </Marker>
          {dropoffLocation && (
            <>
              <Marker position={dropoffLocation}>
                <Popup>Dropoff Location</Popup>
              </Marker>
              <Polyline positions={[pickupLocation, dropoffLocation]} color="black" />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Home;
