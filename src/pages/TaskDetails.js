import React, {useEffect, useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import useFetch from "../custom-hooks/useFetch";
import {Spin, Row, Col, Card, Form, Input, Select, DatePicker, Button, message, Divider} from "antd";
import moment from "moment";
import SubTask from "../components/SubTask";

export default function TaskDetails(props) {
    const [form] = Form.useForm();
    const params = useParams();
    const [task, setTask] = useState(null);
    const [subTask, setSubTask] = useState([]);
    const [assignedTo, setAssignedTo] = useState([]);
    const [categories, setCategories] = useState([]);
    const {get, put, post, Delete, isLoading} = useFetch('https://node-task-manager-backend.herokuapp.com/api/');

    useEffect(() => {
        get(`task/${params.id}`)
            .then(response => {
                console.log(response);
                setTask(response);
                setSubTask(response.subTasks);

                form.setFieldsValue({
                    name: response.name,
                    category: response.category._id + "|" + response.category.name,
                    assignedBy: response.assignedBy.username,
                    assignedTo: response.assignedTo._id + "|" + response.assignedTo.username,
                    dueDate: moment(response.dueDate),
                    reminderDate: moment(response.reminderDate),
                    description: response.description

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

    function handleAddSubTask() {
        console.log("add task");
        let newSubTask = {name: 'Enter Subtask here', status: false,_id:Math.random()+new Date().getMilliseconds()};
        setSubTask([...subTask, newSubTask]);
    }

    function handleEditSubTask(stask) {
        console.log("edit task", stask);
        if('id' in stask){
            console.log('edit');
            put(`subTasks/${stask.id}`, {
                name: stask.name
            })
                .then(response => {
                    message.success(response.message);
                })
                .catch(error => {
                    console.log(error);
                })
        }else{
            console.log('new');
            put(`task/addNewTask/${task.id}`, {subTasks:[{
                    name: stask.name,
                    status: stask.status
                }]
            })
                .then(response => {
                    console.log(response?.data[0]);
                    let newList = subTask.slice(0,subTask.length-1);
                    setSubTask([...newList,response?.data[0]]);
                    message.success(response.message);
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }

    function handleDeleteSubTask(task) {
        console.log("delete task");
        if('id' in task){
            Delete(`subTasks/${task.id}`)
                .then(response => {
                    message.success(response.message);
                    const newList = subTask.filter(st => (st.id !== task.id));
                    setSubTask(newList);
                })
                .catch(error => message.error('Error occurred while deleting'));
        }else{
            const newList = subTask.filter(st => (st.id !== task.id));
            setSubTask(newList);
        }
    }

    function handleSubtaskChange(e, stask) {
        //console.log(e.target.value);
        var newTaskList = subTask.map(task => {
            if (task.id === stask.id) {
                return Object.assign({}, task, {name: e.target.value});
            }
            return task;
        })

        console.log(newTaskList);
        setSubTask(newTaskList);
    }

    function handleSubTaskCheckChange(task) {
        console.log(task);

        const newTaskList = subTask.map(st => {
            if (st.id === task.id) {
                return Object.assign({}, st, {status: !task.status});
            }
            return st;
        });
        console.log(newTaskList);
        setSubTask(newTaskList);

        put(`subTasks/${task.id}`, {
            status: !task.status
        })
        .then(response => {
           message.success(response.message);
        })
        .catch(error => {
            console.log(error);
        })
    }

    return (
        <Spin spinning={isLoading}>
            <Row style={{overflowY: "scroll", height: "calc(100vh - 151px)"}}>
                <Col span={12} offset={6}>

                    <Form layout="vertical"
                          form={form}
                          onFinish={onFinish}
                          onFinishFailed={onFinishFailed}
                    >
                        <h2>Task Details</h2>
                        <Card style={{borderColor: "#1890ff"}}>
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
                                            {categories && categories.map(cata => (
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
                                        <Input readOnly/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Assigned To"
                                               name="assignedTo"
                                    >
                                        <Select loading={isLoading} placeholder={"Please select Assigned To"}>
                                            {assignedTo && assignedTo.map(at => (
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
                        </Card>
                        {/*subtask*/}
                        <h2>Sub Tasks</h2>
                        <Card style={{borderColor: "#1890ff"}}>
                            <Button type="primary" style={{margin: "0 0 10px 10px "}}
                                    onClick={() => handleAddSubTask()}>Add New Task</Button>
                            <table width={"100%"}>
                                <tbody>
                                {subTask && subTask.map((st, index) =>
                                    <SubTask key={st._id} stask={st}
                                             onEditSubTask={handleEditSubTask}
                                             onDeleteSubTask={handleDeleteSubTask}
                                             onSubtaskChange={handleSubtaskChange}
                                             onSubTaskCheckChange={handleSubTaskCheckChange}
                                             sl={index + 1}/>)}
                                </tbody>
                            </table>
                        </Card>
                        {/*subtask end*/}
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item>
                                    <Button type="primary" loading={isLoading} style={{marginTop: 20}}
                                            htmlType="submit">
                                        Save
                                    </Button>

                                    <Link to="/home"><Button type="default" style={{marginTop: 20, marginLeft: 10}}
                                                             htmlType="submit">
                                        Back
                                    </Button></Link>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                </Col>
            </Row>
        </Spin>
    );
}

