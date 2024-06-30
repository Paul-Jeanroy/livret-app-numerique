import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserRole } from './useUserRole';

const useFormationData = (userId) => {
    const {roleUser} = useUserRole();
    const [formationData, setFormationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFormationData = async () => {
            try {
                setLoading(true);
                const responseFormation = await axios.get(`http://localhost:5000/formation/getFormationByUserId?user_id=${userId}&role=${roleUser}`);
                const responseBlocs = await axios.get(`http://localhost:5000/formation/getBlocsCompByFormationId?formation_id=${responseFormation.data.id_formation}`);
                
                setFormationData({
                    formation: responseFormation.data,
                    blocs: responseBlocs.data,
                });
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        if (userId && roleUser) {
            fetchFormationData();
        }
    }, [userId, roleUser]);

    return { formationData, loading, error };
};

export default useFormationData;
