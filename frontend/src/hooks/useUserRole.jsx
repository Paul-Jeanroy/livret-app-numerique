import React, { createContext, useContext, useState, useEffect } from 'react';

const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
    const [roleUser, setRoleUser] = useState('');
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:5000/auth/verify-user', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error("Erreur lors de la vérification de l'utilisateur");
                    }

                    const data = await response.json();
                    if (data.role) {
                        setRoleUser(data.role);
                        setUserId(data.id);
                    } else {
                        throw new Error("Utilisateur non trouvé");
                    }
                } catch (error) {
                    console.error("Erreur lors de la vérification de l'utilisateur:", error);
                    localStorage.removeItem('token');
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };
        fetchUserRole();
    }, []);

    return (
        <UserRoleContext.Provider value={{ roleUser, setRoleUser, userId, setUserId, isLoading }}>
            {children}
        </UserRoleContext.Provider>
    );
};

export const useUserRole = () => useContext(UserRoleContext);
