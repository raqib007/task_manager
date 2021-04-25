import React from 'react';
import jwtDecode from "jwt-decode";
import {Row, Col, Card, Form, Input, DatePicker, Button, Select} from 'antd';
import useFetch from "../custom-hooks/useFetch";
import Task from "../components/Task";

export default function Home(props) {
    const [user, setUser] = React.useState({});
    const [assignedTo, setAssignedTo] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [tasks, setTasks] = React.useState([]);
    const {get, isLoading} = useFetch("https://node-task-manager-backend.herokuapp.com/api/");
    const [form] = Form.useForm();

    React.useEffect(() => {

        if (localStorage.getItem('token')) {
            setUser(jwtDecode(localStorage.getItem('token')));
        }

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

        get("task")
            .then(response => {
                console.log(response);
                setTasks(response);
            }).catch(error => {
            console.log(error);
        });

    }, [])

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    function handleEditClick(task) {
        console.log(task);
    }

    function handleDeleteClick(task) {
        console.log(task);
    }

    return (
        <Row>
            <Col md={{span: 6}}>
                <Card title="Create New Task" style={{overflowY: "scroll", height: "calc( 100vh - 151px)"}}>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        layout="vertical"
                        onFinishFailed={onFinishFailed}
                        form={form}
                    >
                        <Form.Item
                            label="Task Name"
                            name="name"
                            rules={[{required: true, message: 'Please input name!'}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item label="Category"
                                   name="category"
                                   rules={[{required: true, message: 'Please select category!'}]}>
                            <Select loading={isLoading}>
                                {categories.map(cata => (
                                    <Select.Option key={cata._id}
                                                   value={`${cata._id}|${cata.name}`}>
                                        {cata.name}
                                    </Select.Option>))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Assigned By"
                            name="ass_by"
                        >
                            <Input readOnly/>
                        </Form.Item>

                        <Form.Item label="Assigned To"
                                   name="ass_to"
                        >
                            <Select loading={isLoading}>
                                {assignedTo.map(at => (
                                    <Select.Option key={at._id}
                                                   value={`${at._id}|${at.username}`}>
                                        {at.username}
                                    </Select.Option>))}

                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Due Date"
                            name="due_date"
                            rules={[{required: true, message: 'Please select due date!'}]}
                        >
                            <DatePicker style={{width: '100%'}}/>
                        </Form.Item>

                        <Form.Item
                            label="Reminder Date"
                            name="reminder_date"
                        >
                            <DatePicker style={{width: '100%'}}/>
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                        >
                            <Input.TextArea/>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" block htmlType="submit">
                                Add Task
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
            <Col md={{span: 18}} style={{overflowY: "scroll", height: "calc( 100vh - 151px)"}}>
                <Row style={{padding: 5}}>
                    {tasks.map(task => (
                        <Task key={task._id}
                              isLoading={isLoading}
                              task={task}
                              onEditClick={handleEditClick}
                              onDeleteClick={handleDeleteClick}
                        />
                    ))}
                </Row>
            </Col>
        </Row>
    );
}