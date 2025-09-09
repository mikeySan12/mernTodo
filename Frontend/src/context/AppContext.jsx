import { createContext, useEffect, useState } from "react";
import React from "react";

export const AppContent= createContext();

export const AppContextProvider=(props)=>{
    const backendUrl=import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn,setIsLoggedIn]=useState(false);
    const [userData,setUserData]=useState(false);

    const getAuthState = async ()=>{

        try {

            const {data} = await axios.get(backendUrl + '/api/auth/is-auth')

            if(data.success){
                setIsLoggedIn(true);

            }
            
        } catch (error) {
            
        }
    }

    useEffect(()=>{
        getAuthState();
    },[])

    const value ={
        backendUrl,
        isLoggedIn,setIsLoggedIn,
        userData,setUserData

        


    }


    return (
        <AppContent.Provider  value={value}>
            {props.children}



        </AppContent.Provider>
    )

}