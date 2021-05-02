import React, {useContext, useEffect} from 'react';
import {Form, Input, Checkbox, Button, Card, Row, Col} from "antd";
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {AuthContext} from "../context-provider/userContext";
import {useHistory } from 'react-router-dom';

export default function Login(props) {
    const auth = useContext(AuthContext);
    const history = useHistory();

    const onFinish = (values) => {
        props.onLoginClick(values);
    };

    useEffect(()=>{
        if(auth.user !== null){
           history.push("/home");
        }
    },[]);

    return (
        <Row style={{display: 'flex', alignItems: 'center', height: '100vh',backgroundColor:'#f5f5f5'}}>
            <Col lg={{span:6,offset:9}} md={{span:12,offset:6}} xs={{span:16,offset:4}} sm={{span:12,offset:6}}>
                <h1 style={{textAlign:"center"}}>Task Manager</h1>
                <Card title="Login" hoverable style={{borderColor:"#1890ff"}}>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{remember: true}}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{required: true, message: 'Please input your Username!'}]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{required: true, message: 'Please input your Password!'}]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon"/>}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <a className="login-form-forgot" href="/#">
                                Forgot password
                            </a>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={props.isLoading} className="login-form-button">
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                <p style={{textAlign:'center',padding:4}}>Developed By &copy;<a href={"https://rhsabbir.com"} target="_blank" rel="noreferrer">Raqib Hasan</a></p>
            </Col>
        </Row>
    );
}
