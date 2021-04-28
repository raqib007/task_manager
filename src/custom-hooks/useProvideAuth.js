import React,{useState,useEffect} from 'react';
import jwtDecode from "jwt-decode";

export default function useProvideAuth(){
    const [user, setUser] = useState(()=>{
        let userData = null;
        if(localStorage.getItem('token')){
            userData = jwtDecode(JSON.parse(localStorage.getItem('token')));
        }
        console.log(userData);
        return userData;
    });

    async function setAuth(){
        if(localStorage.getItem('token')){
            await setUser(jwtDecode(JSON.parse(localStorage.getItem('token'))));
        }
    }

    async function clearAuth(){
        await setUser(null);
    }

    return {user,setAuth,clearAuth};
}

