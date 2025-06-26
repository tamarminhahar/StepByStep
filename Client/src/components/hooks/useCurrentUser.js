import { useEffect, useState } from 'react';
import APIRequests from "../../services/ApiClientRequests";

export function useCurrentUser() {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const user = await APIRequests.getRequest("users/current");
                setCurrentUser(user);
            } catch (err) {
                console.error(err);
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    return { currentUser, loading };
}
