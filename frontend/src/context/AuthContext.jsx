import { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [dauthUser, setDAuthUser] = useState(JSON.parse(localStorage.getItem('duser') || null));
    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, dauthUser, setDAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
};

