import React, { useEffect, useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../utils/apiPaths';
import axiosInstance from '../utils/axiosInstance';

const useUserAuth = () => {
    const {user, updateUser, clearUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(user) return;

        let isMounted = true;

        const fetchUserInfo = async()=>{
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
                if(isMounted && response.data){
                    updateUser(response.data);
                }
            } catch (error) {
                console.error("failed to fetch user info", error);
                if(isMounted){
                    clearUser();
                    navigate("/login");
                }

            }
        };
    fetchUserInfo();
    return ()=>{
        isMounted = false;
    };
    }, [user, updateUser, clearUser]);
}

export default useUserAuth
