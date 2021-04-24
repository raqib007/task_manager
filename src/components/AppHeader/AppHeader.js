import React from 'react';
import {Layout, Menu} from "antd";
import "./AppHeader.css";
import {NavLink,useHistory} from "react-router-dom";

export default function AppHeader(props) {
    const {Header} = Layout;
    const history = useHistory();

    function handleLogoutClick(){
        if(localStorage.getItem('token')){
            localStorage.removeItem("token");
            history.push("/");
        }

    }

    return (
        <Header className="header">
            <div className="logo">
                TaskManager
            </div>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">
                    <NavLink to="/home">
                        Home
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="2">
                    <NavLink to="/categories">
                        Categories
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="3">
                    <NavLink to="/about">
                        About
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="4">
                    <NavLink to="/contact">
                        Contact
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="5" style={{float:'right'}} onClick={()=>handleLogoutClick()}>
                        Logout
                </Menu.Item>
            </Menu>
        </Header>
    );
}