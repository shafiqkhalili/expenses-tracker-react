import React, { createContext, useReducer } from 'react';
import AppReducer from "./AppReducer";
import axios from 'axios';


//Initial state
const initialState = {
    transactions: [],
    error: null,
    loading: true
};

//Create context
export const GlobalContext = createContext(initialState);

//Provider component
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    //Actions
    async function getTransactions() {
        try {
            const res = await axios('/api/v1/transactions');
            dispatch({
                type: 'GET_TRANSCATIONS',
                payload: res.data.data
            });
        } catch (err) {
            console.log('Error ', err);
            dispatch({
                type: 'TRANSCATION_ERROR',
                payload: err.response.data.error
            });
        };
    }

    async function deleteTransaction(id) {
        try {
            await axios.delete(`/api/v1/transactions/${id}`);

            dispatch({
                type: 'DELETE_TRANSACTION',
                payload: id
            });
        } catch (err) {
            console.log('Error ', err);
            dispatch({
                type: 'TRANSCATION_ERROR',
                payload: err.response.data.error
            });
        };
    }
    async function addTransaction(transaction) {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const res = await axios.post(`/api/v1/transactions/`, transaction, config);

            dispatch({
                type: 'ADD_TRANSACTION',
                payload: res.data.data
            });
        } catch (err) {
            console.log('Error ', err);
            dispatch({
                type: 'TRANSCATION_ERROR',
                payload: err.response.data.error
            });
        };
    }

    return (<GlobalContext.Provider value={{
        transactions: state.transactions,
        error: state.error,
        loading: state.loading,
        deleteTransaction,
        addTransaction,
        getTransactions
    }}>{children}</GlobalContext.Provider>);
};