import { useEffect, useState } from 'react';

export function useCurrentUser() {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch('http://localhost:3000/users/current', {
                    credentials: 'include',
                });

                if (!response.ok) throw new Error('Failed to fetch current user');

                const user = await response.json();
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
