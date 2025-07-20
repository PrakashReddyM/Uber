import React, { useState } from 'react';
import travel from '../assets/driver.webp';
import axios from 'axios';
import { BaseUrl } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CapSignup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        location: "",
        vehicleType: '',
        vehicleNumber: '',
    });
    const [useLocation, setUseLocation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { setAuthUser } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }
        setUseLocation((prev) => !prev);
        if (!useLocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData((prev) => ({
                        ...prev,
                        location: { type: 'Point', coordinates: [longitude, latitude] },
                    }));
                },
                (error) => {
                    console.error("Geolocation error: ", error);
                    setErrorMessage("Unable to fetch location. Please check your browser settings.");
                    setUseLocation(false);
                }
            );
        } else {
            setFormData((prev) => ({ ...prev, location: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        if (!formData.location || formData.location === "") {
            setErrorMessage('Please Allow Access To The Location');
            setLoading(false);
            return;
        }
        try {
            if (formData.location == null) {
                setErrorMessage('Please Allow Access To The Location')
            }
            const { data } = await axios.post(`${BaseUrl}/driver/create`, formData, { withCredentials: true });
            localStorage.setItem('duser', JSON.stringify(data));
            setAuthUser(data);
            setFormData({
                name: '',
                email: '',
                password: '',
                location: '',
                vehicleType: '',
                vehicleNumber: '',
            });
            navigate('/captain-home');
        } catch (error) {
            console.error('Error submitting the form:', error);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || 'An error occurred during signup. Please try again.');
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex max-h-screen justify-center items-center">
            <div className="w-1/3 p-6 mt-10">
                <form onSubmit={handleSubmit} className="rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="shadow font-semibold appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="shadow font-semibold appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className='flex gap-2 mb-4'>
                        <div className="mb-4">
                            <label htmlFor="vehicleType" className="block text-gray-700 text-sm font-bold mb-2">
                                Vehicle Type
                            </label>
                            <select
                                name="vehicleType"
                                value={formData.vehicleType}
                                onChange={handleInputChange}
                                required
                                className="shadow font-semibold text-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option className='font-semibold text-xs' value="" disabled>Select vehicle type</option>
                                <option className='font-bold text-sm' value="car">Car</option>
                                <option className='font-bold text-sm' value="bike">Moto</option>
                                <option className='font-bold text-sm' value="auto">Auto</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="vehicleNumber" className="block text-gray-700 text-sm font-bold mb-2">
                                Vehicle Number
                            </label>
                            <input
                                type="text"
                                name="vehicleNumber"
                                value={formData.vehicleNumber}
                                onChange={handleInputChange}
                                required
                                className="shadow text-sm font-semibold appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                    </div>
                    <div className="mb-6">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={useLocation}
                                onChange={handleCheckboxChange}
                                disabled={loading}
                                className="form-checkbox"
                            />
                            <span className="ml-2 text-sm font-semibold text-gray-800">Use my current location</span>
                        </label>
                    </div>
                    {errorMessage && (
                        <div className="text-red-500 text-sm mb-4">{errorMessage}</div> // Display the error message
                    )}

                    <button
                        type="submit"
                        className="bg-gray-950 text-[15px] w-full hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Captain Sign Up"}
                    </button>
                </form>
            </div>
            <div className="w-1/2 flex justify-center items-center mt-10">
                <img src={travel} alt="travel" className="w-[400px] h-auto rounded-lg shadow-md" />
            </div>
        </div>
    );
};

export default CapSignup;
