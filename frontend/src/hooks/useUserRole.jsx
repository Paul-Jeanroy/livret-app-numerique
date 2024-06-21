import { createContext, useContext, useState, useEffect } from 'react';

const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
    const [roleUser, setRoleUser] = useState(() => {
        return localStorage.getItem('roleUser') || '';
    });

    useEffect(() => {
        localStorage.setItem('roleUser', roleUser);
    }, [roleUser]);

    return (
        <UserRoleContext.Provider value={{ roleUser, setRoleUser }}>
            {children}
        </UserRoleContext.Provider>
    );
};

export const useUserRole = () => useContext(UserRoleContext);
