import { createContext, useContext, useState, useEffect } from 'react';

const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
    const [roleUser, setRoleUser] = useState(() => {
        return localStorage.getItem('roleUser') || '';
    });

    const [userId, setUserId] = useState(() => {
        return localStorage.getItem('userId') || '';
    });

    useEffect(() => {
        localStorage.setItem('roleUser', roleUser);
    }, [roleUser]);

    useEffect(() => {
        localStorage.setItem('userId', userId);
    }, [userId]);

    return (
        <UserRoleContext.Provider value={{ roleUser, setRoleUser, userId, setUserId }}>
            {children}
        </UserRoleContext.Provider>
    );
};

export const useUserRole = () => useContext(UserRoleContext);
