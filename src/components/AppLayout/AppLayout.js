import React from 'react';
import {Layout} from "antd";
import AppHeader from "../AppHeader/AppHeader";
import AppFooter from "../AppFooter/AppFooter";

export default function AppLayout(props) {
    const {Content} = Layout;
    return (
        <Layout style={{height: "100vh"}} className="layout">
            <AppHeader/>
            <Content style={{padding: '0 50px',marginTop:20}}>
                <div>
                    {props.children}
                </div>
            </Content>
            <AppFooter/>
        </Layout>
    );
}