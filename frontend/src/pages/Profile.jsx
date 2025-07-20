import React from 'react';
import profile from '../assets/default.png'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
    const { authUser, dauthUser } = useAuth()
    const name = authUser.name || dauthUser.name;
    const email = authUser.email || dauthUser.email;
    return (
        <div className="w-full max-h-screen flex">
            <div className="w-1/5 bg-gray-50 py-6">
                <ul className="space-y-2 font-semibold text-gray-800">
                    <li className="cursor-pointer p-2 bg-gray-200">Account Info</li>
                    <li className="cursor-pointer p-2 ">Security</li>
                    <li className="cursor-pointer p-2 ">Privacy & Data</li>
                </ul>
            </div>

            <div className="w-3/4 p-6 ml-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Account Info</h2>

                <div className="my-6">
                    <img className='w-32' src={profile} alt="profile" />
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Basic Info</h3>
                    <div className="mb-4">
                        <p className="font-semibold text-gray-800">Name:</p>
                        <p className=" font-normal border-b w-96 pb-4 text-md my-2 text-gray-600">{name}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">Email:</p>
                        <p className="font-normal border-b w-96 pb-4 text-sm my-2 text-gray-600">{email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
