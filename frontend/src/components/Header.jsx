import React from 'react';
import logo from '../assets/logo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdLogout } from "react-icons/md";
import axios from 'axios';
import { BaseUrl } from '../utils/api';

const Header = () => {
    const { authUser, dauthUser, setAuthUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const { data } = await axios.get(`${BaseUrl}/auth/logout`, { withCredentials: true });
            console.log(data);
            setAuthUser({});
            localStorage.removeItem('user');
            localStorage.removeItem('duser')
            navigate('/login');
        } catch (error) {
            console.error('Error in Logging out:', error);
        }
    };

    return (
        <div className="bg-black h-16 px-14 pr-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-10">
                <Link to={'/'}>
                    <img
                        src={logo}
                        alt="logo"
                        className="w-16 cursor-pointer"
                    />
                </Link>
                <div className="hidden text-[15px] font-semibold md:flex gap-6">
                    <p className="cursor-pointer hover:text-gray-300">Ride</p>
                    <p className="cursor-pointer hover:text-gray-300">Drive</p>
                    <p className="cursor-pointer hover:text-gray-300">Business</p>
                    <p className="cursor-pointer hover:text-gray-300">About</p>
                </div>
            </div>

            {/* User Actions */}
            <div className="flex gap-6 text-[15px] mr-16 items-center font-semibold">
                {(authUser !== null) || (dauthUser !== null) ? (
                    <>
                        <p>
                            Hi, <Link to={'/profile'} className="text-green-400">Prakash</Link>
                        </p>
                        <MdLogout
                            onClick={handleLogout}
                            className="text-[18px] cursor-pointer hover:text-red-400"
                            title="Logout"
                        />
                    </>
                ) : (
                    <>
                        <Link to={'/login'} className="cursor-pointer hover:text-gray-300">
                            Log In
                        </Link>
                        <Link
                            to={'/signup'}
                            className="cursor-pointer text-gray-800 bg-white px-2 rounded-lg py-1"
                        >
                            Sign up
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Header;
