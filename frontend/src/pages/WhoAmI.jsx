import { useEffect, useState } from 'react';
import axios from 'axios';

import { baseApiURL } from "../App.jsx";


const WhoAmI = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${baseApiURL}/v1/auth/whoami`, {
                    withCredentials: true,  // Include cookies in the request
                });
                setUserData(response.data);
                setUserData(response.data.data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div>
            {userData ? (
                <div>
                    <h2>{userData.name}</h2>
                    <p>{userData.email}</p>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default WhoAmI;