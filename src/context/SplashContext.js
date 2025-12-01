import React, { createContext, useContext, useState } from 'react';

const SplashContext = createContext();

export const SplashProvider = ({ children }) => {
    const [isShowSplash, setIsShowSplash] = useState(true);

    return (
        <SplashContext.Provider value={{ isShowSplash, setIsShowSplash }}>
            {children}
        </SplashContext.Provider>
    );
};

export const useSplash = () => useContext(SplashContext);
