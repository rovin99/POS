// Et eksempel på en komponent, der bruger isLoggedIn og username
import React from 'react';
import { useAuth } from './AuthContext';

const Profile = () => {
    const { isLoggedIn, username } = useAuth();

    return (
        <div>
            {isLoggedIn ? <p>Velkommen, {username}!</p> : <p>Du er ikke logget ind.</p>}
        </div>
    );
};

export default Profile;
