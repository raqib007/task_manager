import React from 'react';
import {Layout} from "antd";

export default function AppFooter(){
    return(
        <Layout.Footer style={{ textAlign: 'center' }}>Task Manager ©{new Date().getFullYear()} Created by Raqib Hasan</Layout.Footer>
    );
}