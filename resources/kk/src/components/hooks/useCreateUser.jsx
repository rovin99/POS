import { useContext } from 'react';
import axios from 'axios';
import APIConfig from '../config';
import { useToast } from '../Contexts/ToastContext';

const useCreateUser = () => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  const { showToast } = useToast();
  const createUser = async (formData) => { // Bemærk 'async' her
    try {
      const response = await axios.post(`${window.App.url}/create-client-user`, formData, {
        withCredentials: true,
        headers: {
          'X-CSRF-TOKEN': csrfToken,
        },
      });
      console.log('User Created:', response.data);
      showToast(response.data.message || "User created successfully!");
      return response; // Returnerer axios response objektet
    } catch (error) {
      console.error('There was an error creating the user:', error);
      showToast("Error creating user");
      throw error; // Vigtigt at kaste fejlen videre for at kunne fange den i try-catch i din komponent
    }
  };

  return createUser;
};

export default useCreateUser;
