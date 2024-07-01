
import { useState, useEffect } from 'react';

const useUsersByFormation = (userId) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);  

        try {
            const response = await fetch(`http://localhost:5000/user/getIdFormationByUser?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Erreur HTTP, statut : ' + response.status + ', message : ' + errorText);
            }

            const data = await response.json();
            setUsers(data);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUsers();
        }
    }, [userId]);

    return { users, loading, error, setUsers, fetchUsers };
};

export default useUsersByFormation;
