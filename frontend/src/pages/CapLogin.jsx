import React, { useState } from 'react';
import travel from '../assets/driver.webp';
import axios from 'axios';
import { BaseUrl } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const CapLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        location: null,
    });
    const [useLocation, setUseLocation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
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
        if (useLocation) {
            setFormData((prev) => ({ ...prev, location: null }));
        } else {
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
                    alert("Unable to fetch location. Please check your settings.");
                    setUseLocation(false);
                }
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post(`${BaseUrl}/driver/login`, formData, { withCredentials: true });
            localStorage.setItem('duser', JSON.stringify(data));
            setAuthUser(data);
            setFormData({ email: '', password: '', location: null });
            navigate('/captain-home');
        } catch (error) {
            console.error('Error during login:', error);
            setError('Login failed. Please check your credentials and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex max-h-screen justify-center items-center">
            <div className="w-1/3 p-6 mt-10">
                <form onSubmit={handleSubmit} className="rounded px-8 pt-16 pb-8 mb-4">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
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
                            onChange={handleInputChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor=""></label>
                    </div>
                    {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
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
                    <button
                        type="submit"
                        className="bg-gray-950 text-[15px] w-full hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Captain Log In"}
                    </button>
                </form>
            </div>
            <div className="w-1/2 flex justify-center items-center mt-20">
                <img src={travel} alt="travel" className="w-[400px] h-auto rounded-lg shadow-md" />
            </div>
        </div>
    );
};

export default CapLogin;
