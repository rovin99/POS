import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const isLoggedIn = Cookies.get('isLoggedIn') === 'true';
        const username = Cookies.get('username');
        if (isLoggedIn && username) {
            setIsLoggedIn(true);
            setUsername(username);
        }
    }, []);

    const inTenYears = new Date(new Date().getTime() + 10 * 365 * 24 * 60 * 60 * 1000);

    const setCookies = (name, value) => {
        Cookies.set(name, value, { expires: inTenYears });
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, username, setUsername, setCookies }}>
            {children}
        </AuthContext.Provider>
    );
};
