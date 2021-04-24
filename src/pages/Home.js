import React from 'react';
import jwtDecode from "jwt-decode";

export default function Home(props){
    const [user,setUser] = React.useState({});

    React.useEffect(()=>{
          if(localStorage.getItem('token')){
              setUser(jwtDecode(localStorage.getItem('token')));
          }
    },[])

    return(
      <h1>Welcome {user.username}</h1>
    );
}