import React, { createContext, useContext, useState } from 'react';

export const RideContext = createContext();

export const RideProvider = ({ children }) => {
    const [rideInfo, setRideInfo] = useState({});


    return (
        <RideContext.Provider
            value={{
                rideInfo, setRideInfo
            }}
        >
            {children}
        </RideContext.Provider>
    );
};

export const useRide = () => {
    return useContext(RideContext);
};
