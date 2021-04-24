import './App.css';
import {Switch, Route, useHistory} from "react-router-dom";
import AppLayout from "./components/AppLayout/AppLayout";
import Category from "./pages/Category";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import {useState, useEffect} from 'react';
import Login from "./pages/Login";
import useFetch from "./custom-hooks/useFetch";

function App() {
    const baseUrl = "https://node-task-manager-backend.herokuapp.com/api/";
    const [user, setUser] = useState({});
    const [isLoggedIn,setIsLoggedIn] = useState(false);
    const history = useHistory();
    const {post, isLoading} = useFetch(baseUrl);

    useEffect(() => {

        setUser(JSON.parse(localStorage.getItem('token')));
        if(user === null){
            history.push("/");
        }else{
            setIsLoggedIn(true);
            history.push("/home");
        }

    }, [isLoggedIn]);

    function handleLogin(loggedUser) {
        console.log(loggedUser);
        post('signin',{
           username:loggedUser.username,password:loggedUser.password
        }).then(response=>{
            console.log(response);
            if(response?.token){
                localStorage.setItem("token",JSON.stringify(response.token));
                setIsLoggedIn(true);
                history.push('/home');
            }else{

            }
        });
    }

    return (
            <Switch>
                <Route path="/" exact>
                    <Login onLoginClick={handleLogin} isLoading={isLoading}/>
                </Route>
                <Route path="/home" >
                    <AppLayout>
                        <Home user={user}/>
                    </AppLayout>
                </Route>
                <Route path="/categories">
                    <AppLayout>
                        <Category/>
                    </AppLayout>
                </Route>
                <Route path="/about">
                    <AppLayout>
                        <About/>
                    </AppLayout>
                </Route>
                <Route path="/contact">
                    <AppLayout>
                        <Contact/>
                    </AppLayout>
                </Route>
                <Route>
                    <h3 style={{display: "flex", justifyContent: "center"}}>404 Not Found</h3>
                </Route>
            </Switch>
    );
}

export default App;
