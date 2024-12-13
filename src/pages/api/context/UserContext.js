import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CryptoJS from 'crypto-js';
import api from "../../../configs/axios/satufarmasi-service-axios"
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
import { useRouter } from 'next/router';
const UserContext = createContext();

const encryptData = (data) => CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
const decryptData = (cipherText) => JSON.parse(CryptoJS.AES.decrypt(cipherText, secretKey).toString(CryptoJS.enc.Utf8));

const localStorageIsInvalid = async (router) => {
    try {
        await api.delete("/api/v1/users/")
        return router.push("/auth/login");
    } catch (error) {
        console.log("Local storage error: ", error);
    }
}

export const UserProvider = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);

    UserProvider.propTypes = {
        children: PropTypes.node.isRequired,
    };


    useEffect(() => {
        (async () => {
            const storageHandler = async () => {
                try {
                    setUser(decryptData(storedUser));
                } catch (error) {
                    await localStorageIsInvalid(router);
                    localStorage.removeItem('user');
                    console.error('Local Storage User is not valid');
                }
            }
            const storedUser = localStorage.getItem('user');
            if (storedUser) await storageHandler();
        }
        )();
    }, []);

    useEffect(() => {
        if (user) localStorage.setItem('user', encryptData(user));
    }, [user]);

    return (
        <UserContext.Provider value={React.useMemo(() => ({ user, setUser }), [user, setUser])}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
