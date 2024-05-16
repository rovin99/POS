
import React, { createContext, useState, useContext } from 'react';

const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
    const [refreshKey, setRefreshKey] = useState(0);


    const refreshData = () => {
        console.log("Refreshing data...");
        setRefreshKey(oldKey => oldKey + 1);
    };
    

    return (
        <RefreshContext.Provider value={{ refreshKey, refreshData }}>
            {children}
        </RefreshContext.Provider>
    );
};

export const useRefresh = () => useContext(RefreshContext);
