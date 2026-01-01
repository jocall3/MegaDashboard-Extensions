import React, { createContext, useContext, useState } from 'react';
import { UserContextType, UserRole } from '../types';

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<{ id: string; name: string; role: UserRole }>({
        id: 'user-current',
        name: 'John Doe',
        role: 'standard_user',
    });

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};