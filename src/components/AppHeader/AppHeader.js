import React, {useContext} from 'react';
import {Layout, Menu, Icon} from "antd";
import "./AppHeader.css";
import {NavLink,useHistory,useLocation} from "react-router-dom";
import {AuthContext} from "../../context-provider/userContext";

export default function AppHeader(props) {
    const auth = useContext(AuthContext);
    const {Header} = Layout;
    const history = useHistory();
    const location = useLocation();

    function handleLogoutClick(){
        if(localStorage.getItem('token')){
            localStorage.removeItem("token");
            auth.clearAuth().then(()=>{
                history.push("/");
            })

        }
    }

    return (
        <Header className="header">
            <div className="logo">
                TaskManager
            </div>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[location.pathname]}>
                <Menu.Item key="/home">
                    <NavLink to="/home">
                        Home
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="/categories">
                    <NavLink to="/categories">
                        Categories
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="/about">
                    <NavLink to="/about">
                        About
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="/contact">
                    <NavLink to="/contact">
                        Contact
                    </NavLink>
                </Menu.Item>
                <Menu.Item style={{float:'right'}} onClick={()=>handleLogoutClick()}>
                        Logout
                </Menu.Item>
            </Menu>
        </Header>
    );
}
