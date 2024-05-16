
import React, { createContext, useContext, useState } from 'react';
import { ToastContainer, Toast } from 'react-bootstrap';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message) => {
        setToasts([...toasts, { message, id: Date.now() }]);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer position="top-end">
                {toasts.map(toast => (
                    <Toast key={toast.id} onClose={() => setToasts(toasts.filter(t => t.id !== toast.id))} delay={5000} autohide>
                        <Toast.Body>{toast.message}</Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
};
