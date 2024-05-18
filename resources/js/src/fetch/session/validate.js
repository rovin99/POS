import axios from 'axios';
import { useEffect } from 'react';
import APIConfig from "./config";

function SessionValidator({ onSessionValid, onSessionInvalid }) {
  useEffect(() => {s
    axios.get(`${APIConfig.baseDomain}/apishh/ADMIN/verify.php`, { withCredentials: true })
      .then(response => {
        // Hvis sessionen er gyldig, kald onSessionValid callback
        if (response.data.success) {
          onSessionValid();
        } else {
          onSessionInvalid();
        }
      })
      .catch(error => {
        // Hvis ikke gyldig, kald onSessionInvalid callback
        onSessionInvalid();
      });
  }, [onSessionValid, onSessionInvalid]);

  return null; // Denne komponent viser ikke noget, men handler logik
}

export default SessionValidator;
