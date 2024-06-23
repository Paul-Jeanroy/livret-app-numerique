import { useState, useEffect } from 'react';

const useUsersByFormation = (userId) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUserByFormation = async (userId) => {
            try {
                const response = await fetch(`http://localhost:5000/user/getIdFormationByUser?userId=${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error('Erreur HTTP, statut : ' + response.status + ', message : ' + errorText);
                }

                const data = await response.json();
                setUsers(data);
                setLoading(false);

            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        if (userId) {
            getUserByFormation(userId);
        }
    }, [userId]);

    return { users, loading, error, setUsers };
};

export default useUsersByFormation;
