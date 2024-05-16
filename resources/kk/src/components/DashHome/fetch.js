import React, { useEffect, useState } from 'react';
import axios from 'axios';
import APIConfig from '../config';
const TransactionData = ({ render, userId, period = '30 days', userType }) => {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = { period };
                if (userId) params.userId = userId;
                if (userType) params.userType = userType;

                const response = await axios.get(`${window.App.url}/transactionsview`, {
                    params: params,
                    withCredentials: true
                });
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching data: ', error);
                setError('Error fetching data');
            }
        };
        fetchData();
    }, [userId, period, userType]);

    return render({ transactions, error });
};
export default TransactionData;

