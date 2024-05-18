import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Opret en context
const CommentsContext = createContext();

// Provider-komponent
export const CommentsProvider = ({ children }) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        // Hent kommentarer fra backend
        const fetchComments = async () => {
            try {
                const response = await axios.get(`${window.App.url}/comments`);
                setComments(response.data);
            } catch (error) {
                console.error('Fejl ved hentning af kommentarer:', error);
                // Her kan du sætte fejlhåndtering, f.eks. ved at gemme fejlbeskeden i en tilstand
            }
        };

        fetchComments();
    }, []); // Tomt afhængighedsarray sikrer, at effekten kun kører en gang

    return (
        <CommentsContext.Provider value={comments}>
            {children}
        </CommentsContext.Provider>
    );
};

// Hook for at bruge context
export const useComments = () => useContext(CommentsContext);
