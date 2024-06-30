import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserRole } from './useUserRole';

const useFormationData = (userId, selectedApprenti) => {
    const { roleUser } = useUserRole();
    const [formationData, setFormationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFormationData = async () => {
            try {
                setLoading(true);
                let responseFormation;

                if (roleUser === "maître d'apprentissage") {
                    console.log("-----------------------------");
                    const apprentiId = selectedApprenti;
                    console.log("apprentiId", apprentiId);
                    if (!apprentiId) {
                        setError('Aucun apprenti sélectionné');
                        setLoading(false);
                        return;
                    }
                    responseFormation = await axios.get(`http://localhost:5000/formation/getFormationByApprentiId?apprenti_id=${apprentiId}&maitre_id=${userId}`);
                } else {
                    responseFormation = await axios.get(`http://localhost:5000/formation/getFormationByUserId?user_id=${userId}&role=${roleUser}`);
                }

                const responseBlocs = await axios.get(`http://localhost:5000/formation/getBlocsCompByFormationId?formation_id=${responseFormation.data.id_formation}`);
                const responseInfo = await axios.get(`http://localhost:5000/livret/getFormationInfo?apprentiId=${selectedApprenti || userId}`);

                setFormationData({
                    formation: responseFormation.data,
                    blocs: responseBlocs.data,
                    info: responseInfo.data,
                });
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        if (userId && roleUser && (roleUser !== "maître d'apprentissage" || selectedApprenti)) {
            fetchFormationData();
        }
    }, [userId, roleUser, selectedApprenti]);

    return { formationData, loading, error };
};

export default useFormationData;
