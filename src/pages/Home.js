import React, {useContext} from 'react';
import {Row, Col, Card, Form, Input, DatePicker, Button, Select, message, Spin, Drawer} from 'antd';
import useFetch from "../custom-hooks/useFetch";
import Task from "../components/Task";
import moment from "moment";
import {useHistory} from 'react-router-dom';
import {AuthContext} from "../context-provider/userContext";
import './css/Home.css';

export default function Home(props) {
    const auth = useContext(AuthContext);
    const [modeEdit, setModeEdit] = React.useState(null);
    const [form] = Form.useForm();
    const [visible, setvisible] = React.useState(false);

    const [assignedTo, setAssignedTo] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [tasks, setTasks] = React.useState([]);
    const {get, post, put, Delete, isLoading} = useFetch("https://node-task-manager-backend.herokuapp.com/api/");
    const history = useHistory();

    React.useEffect(() => {
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
                setAssignedTo(response.filter(at => at.username !== auth.user.username));
            }).catch(error => {
            console.log(error);
        });

        get("task")
            .then(response => {
                console.log(response);
                setTasks(response.filter(task => task.status === 0));
            }).catch(error => {
            console.log(error);
        });

        form.setFieldsValue({
            assignedBy: auth.user.username
        })


    }, []);

    const refreshTaskList = () => {
        get("task")
            .then(response => {
                console.log(response);
                setTasks(response.filter(task => task.status === 0));
            }).catch(error => {
            console.log(error);
        });
    }

    const onFinish = (values) => {
        console.log('Success:', values);

        if (modeEdit !== null) {

            put('task/' + modeEdit._id, {
                "name": values.name,
                "category": values.category.split("|")[0],
                "description": values.description,
                "dueDate": values.dueDate,
                "reminderDate": values.reminderDate,
                "status": 0,
                "assignedBy": auth.user.id,
                "assignedTo": values.assignedTo.split("|")[0]
            }).then(response => {
                    console.log(response);
                    message.success('Task update success');
                    form.resetFields();
                    form.setFieldsValue({
                        assignedBy: auth.user.username
                    })

                    refreshTaskList();
                    setModeEdit(null);
                    onClose();
                }
            ).catch(error => {
                message.error('Error Occurred while updating task');

            });
        } else {
            post('task', {
                "name": values.name,
                "category": values.category.split("|")[0],
                "description": values.description,
                "dueDate": values.dueDate,
                "reminderDate": values.reminderDate,
                "status": 0,
                "assignedBy": auth.user.id,
                "assignedTo": values.assignedTo.split("|")[0],
                "subTasks":[]
            }).then(response => {
                    console.log(response);
                    message.success('Task add success');
                    form.resetFields();
                    form.setFieldsValue({
                        assignedBy: auth.user.username
                    })

                    refreshTaskList();
                }
            ).catch(error => {
                message.error('Error Occurred while adding task');
            });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const showDrawer = () => {
        setvisible(true)
        form.setFieldsValue({
            assignedBy: auth.user.username
        })
    };

    const onClose = () => {
        setvisible(false);
        setModeEdit(null);
        form.resetFields();
    };

    function handleViewClick(id) {
        console.log(id);
        history.push(`/task/${id}`);
    }

    function handleEditClick(task) {
        console.log(task);
        form.setFieldsValue({
            name: task.name,
            category: task.category._id + "|" + task.category.name,
            assignedTo: task.assignedTo._id + "|" + task.assignedTo.username,
            dueDate: moment(task.dueDate),
            reminderDate: moment(task.reminderDate),
            description: task.description
        });
        showDrawer();
        setModeEdit(task);
    }

    function handleDeleteClick(task) {
        console.log(task);
        Delete('task/' + task._id).then(response => {
                console.log(response);
                message.success('Task delete success');
                get("task")
                    .then(response => {
                        console.log(response);
                        setTasks(response);
                    }).catch(error => {
                    console.log(error);
                });
            }
        ).catch(error => {
            console.log(error);
            message.error('Error Occurred while deleting task');
        });
    }

    function handleResolveClick(task) {
        console.log(task);
        put('task/' + task._id, {
            "status": 1,
        }).then(response => {
                console.log(response);
                message.success('Task Resolved');
                refreshTaskList();
            }
        ).catch(error => {
            message.error('Error Occurred while updating task');
        });
    }

    return (
        <>
            <Button type="primary" style={{margin: "0 0 10px 10px "}} onClick={() => showDrawer()}>Add New Task</Button>
            <Spin spinning={isLoading}><Row>
                <Col md={{span: 24}}
                     style={{overflowY: "scroll", height: "calc( 100vh - 181px)"}}>
                    <Row style={{padding: 5}}>

                        {tasks.map(task => (
                            <Task key={task._id}
                                  isLoading={isLoading}
                                  task={task}
                                  onEditClick={handleEditClick}
                                  onDeleteClick={handleDeleteClick}
                                  onResolveClick={handleResolveClick}
                                  onViewClick={handleViewClick}
                            />
                        ))}

                    </Row>
                </Col>
            </Row>
            </Spin>
            <Drawer
                title={modeEdit !== null ? 'Update Task' : 'Create New Task'}
                width={"50vw"}
                onClose={onClose}
                visible={visible}
                bodyStyle={{paddingBottom: 80}}
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Button onClick={onClose} style={{marginRight: 8}}>
                            Close
                        </Button>
                    </div>
                }
            >
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
                                <Input value={auth.user?.username} readOnly/>
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
                                <Button type="primary" loading={isLoading} style={{marginTop: 20}} htmlType="submit">
                                    {modeEdit !== null ? 'Update' : 'Save'}
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
}
