import React from 'react'

const Trip = (driverInfo, TripInfo) => {
    return (
        <div className="flex flex-col md:flex-row w-full justify-evenly mt-10 items-center">
            <div className="w-full max-w-sm max-h-[470px] shadow-xl rounded-md p-10 px-0 pt-0">
                <p className="font-bold text-[22px] text-gray-800 px-3">Looking for nearby drivers</p>
                <div className="relative mt-2 h-1.5 w-full overflow-hidden">
                    <div className="absolute h-full w-full bg-blue-300 rounded-md loading-line"></div>
                </div>
                <div className="w-full h-48 flex justify-center items-center mt-5">
                    <img src={vehicleImage} alt={vehicle || "Vehicle"} className="w-36 h-auto" />
                </div>
                <div className="flex flex-col gap-3">
                    <div className="w-full flex justify-start my-2 mx-4 items-center gap-2">
                        <FaDotCircle />
                        <p className="font-semibold text-sm text-gray-700">{pickupInput}</p>
                    </div>
                    <div className="w-full flex justify-start my-2 mx-4 items-center gap-2">
                        <TbSquareDotFilled />
                        <p className="font-semibold text-sm text-gray-700">{dropoffInput}</p>
                    </div>
                    <div className="w-full flex mb-6 justify-start my-2 mx-4 items-center gap-4">
                        <FaCreditCard />
                        <p className="font-semibold text-sm text-gray-700">₹{info.motoFare}/-</p>
                    </div>
                    <button
                        type="submit"
                        onClick={() => { navigate('/') }}
                        className="w-full text-red-500 bg-red-50 hover:bg-red-100 h-10"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            <div className="w-[700px] h-[450px] mt-6">
                <MapContainer center={info.pickUpLocation.coordinates} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={info.pickUpLocation.coordinates}>
                        <Popup>Pickup Location</Popup>
                    </Marker>
                    {info.dropOffLocation.coordinates && (
                        <>
                            <Marker position={info.dropOffLocation.coordinates}>
                                <Popup>Dropoff Location</Popup>
                            </Marker>
                            <Polyline positions={[info.pickUpLocation.coordinates, info.dropOffLocation.coordinates]} color="black" />
                        </>
                    )}
                    {/* {drivers.map((driver, index) => {
                            const driverCoordinates = driver?.location?.coordinates;
                            if (!driverCoordinates || driverCoordinates.length !== 2) {
                                console.error(`Invalid coordinates for driver at index ${index}:`, driverCoordinates);
                                return null;
                            }
                            return (
                                <Marker key={index} position={driverCoordinates}>
                                    <Popup>{driver.name || "Driver"}</Popup>
                                </Marker>
                            );
                        })} */}

                </MapContainer>
            </div>
        </div>
    );
}

export default Trip