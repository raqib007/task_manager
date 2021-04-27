import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import useFetch from "../custom-hooks/useFetch";
import {Spin, Row, Col, Card, Form, Input, Select, DatePicker, Button, message, Divider} from "antd";
import moment from "moment";

export default function TaskDetails(props) {
    const [form] = Form.useForm();
    const params = useParams();
    const [task, setTask] = useState({});
    const [assignedTo, setAssignedTo] = useState([]);
    const [categories, setCategories] = useState([]);
    const {get, put, isLoading} = useFetch('https://node-task-manager-backend.herokuapp.com/api/');


    useEffect(() => {
        get(`task/${params.id}`)
            .then(response => {
                console.log(response);
                setTask(response);

                form.setFieldsValue({
                    name: response.name,
                    category: response.category._id+"|"+response.category.name,
                    assignedBy: response.assignedBy.username,
                    assignedTo: response.assignedTo._id+"|"+response.assignedTo.username,
                    dueDate: moment(response.dueDate),
                    reminderDate:moment(response.reminderDate),
                    description:response.description

                });
            }).catch(error => {
            console.log(error);
        })

        get("category")
            .then(response => {
                console.log(response);
                setCategories(response);
            }).catch(error => {
            console.log(error);
        });

        get("v1/users")
            .then(response => {
                console.log(response);
                setAssignedTo(response);
            }).catch(error => {
            console.log(error);
        });




    }, []);


    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Spin spinning={isLoading}>
            <Row>
                <Col span={14} offset={5}>
                    <h2>Task Details</h2>
                    <Divider/>
                    <Form layout="vertical"
                          form={form}
                          onFinish={onFinish}
                          onFinishFailed={onFinishFailed}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Task Name"
                                    name="name"
                                    rules={[{required: true, message: 'Please input name!'}]}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Category"
                                           name="category"
                                           rules={[{required: true, message: 'Please select category!'}]}>
                                    <Select loading={isLoading} placeholder={"Please select category"}>
                                        {categories.map(cata => (
                                            <Select.Option key={cata._id}
                                                           value={`${cata._id}|${cata.name}`}>
                                                {cata.name}
                                            </Select.Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Assigned By"
                                    name="assignedBy"
                                >
                                    <Input  readOnly/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Assigned To"
                                           name="assignedTo"
                                >
                                    <Select loading={isLoading} placeholder={"Please select Assigned To"}>
                                        {assignedTo.map(at => (
                                            <Select.Option key={at._id}
                                                           value={`${at._id}|${at.username}`}>
                                                {at.username}
                                            </Select.Option>))}

                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Due Date"
                                    name="dueDate"
                                    rules={[{required: true, message: 'Please select due date!'}]}
                                >
                                    <DatePicker style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Reminder Date"
                                    name="reminderDate"
                                >
                                    <DatePicker style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="Description"
                                    name="description"
                                >
                                    <Input.TextArea/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={4}>
                                <Form.Item>
                                    <Button type="primary" loading={isLoading} style={{marginTop: 20}}
                                            htmlType="submit">
                                        Save
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Spin>
    );
}

