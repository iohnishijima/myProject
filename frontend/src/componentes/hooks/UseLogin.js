import React, {useContext, useState} from 'react'
import {useNavigate} from "react-router-dom"
import axios from "axios";
import { LoginUserContext } from '../providers/LoginUserProvider';

export const UseLogin = () => {
    const {setLoginUser, setIsLogined} = useContext(LoginUserContext);
    const navigate = useNavigate();
    const login = (user) => {
        console.log("login process");
        console.log(user)
        // const endpoint="https://jsonplaceholder.typicode.com/users";
        const endpoint="http://127.0.0.1:8000/users";
        // const endpoint="http://localhost:8000/users";
        const queries = {name:user.username, password:user.password}
        axios.get(endpoint, {params: queries})
        .then((res => {
            console.log(res.data);
            if(res.data === undefined){
                console.log("failed log in");
                navigate("/loginfailed")
            }
            else{
                console.log("log in success")
                setLoginUser(res.data)
                setIsLogined(true);
                navigate("/main", {state:{username:"abc"}});
            }
        }))
        .catch((event)=>{
            console.log(event)
            setLoginUser({username:"",password:""})
            navigate("/loginfailed")
        })
    }
  return {login}
}

