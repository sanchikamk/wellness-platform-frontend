// PlatformContext.js
import { createContext, useContext, useState } from 'react';

const PlatformContext = createContext();

export const PlatformProvider = ({ children }) => {
  const [selectedCouncellor, setSelectedCouncellor] = useState(null);

  return (
    <PlatformContext.Provider value={{ selectedCouncellor, setSelectedCouncellor }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatformContext = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatformContext must be used within a PlatformProvider');
  }
  return context;
};
