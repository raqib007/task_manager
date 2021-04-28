import './App.css';
import {Switch, Route, useHistory, Redirect, useLocation} from "react-router-dom";
import AppLayout from "./components/AppLayout/AppLayout";
import Category from "./pages/Category";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import {useEffect, useContext} from 'react';
import Login from "./pages/Login";
import useFetch from "./custom-hooks/useFetch";
import TaskDetails from "./pages/TaskDetails";
import {AuthContext} from "./context-provider/userContext";
import {message} from "antd";

function App() {
    const auth = useContext(AuthContext);
    const baseUrl = "https://node-task-manager-backend.herokuapp.com/api/";
    const history = useHistory();
    const {post, isLoading} = useFetch(baseUrl);
    const location = useLocation();

    function ProtectedRoute({children, ...rest}) {
        return (
            <Route {...rest}
                   render={({location}) =>
                       auth.user ? (children) : (<Redirect to={{pathname: "/", state: {from: location}}}/>)
                   }
            />
        )
    }

    function handleLogin(loggedUser) {
        console.log(loggedUser);
        post('signin', {
            username: loggedUser.username, password: loggedUser.password
        }).then(response => {
            console.log(response);
            if (response?.token) {
                localStorage.setItem('token',JSON.stringify(response.token));
                auth.setAuth().then(()=>{
                    let { from } = location.state || { from: { pathname: "/home" } };
                    console.log(from);
                    history.replace(from);
                });

            }else{
                message.error(response.message);
            }

        }).catch(error => {
            console.log(error);

        });
    }

    return (
        <Switch>
            <Route path="/" exact>
                <Login onLoginClick={handleLogin} isLoading={isLoading}/>
            </Route>
            <ProtectedRoute path="/home">
                <AppLayout>
                    <Home/>
                </AppLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/categories">
                <AppLayout>
                    <Category/>
                </AppLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/about">
                <AppLayout>
                    <About/>
                </AppLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/contact">
                <AppLayout>
                    <Contact/>
                </AppLayout>
            </ProtectedRoute>
            <ProtectedRoute path="/task/:id" exact>
                <AppLayout>
                    <TaskDetails/>
                </AppLayout>
            </ProtectedRoute>
            <Route>
                <h3 style={{display: "flex", justifyContent: "center"}}>404 Not Found</h3>
            </Route>
        </Switch>
    );
}

export default App;
