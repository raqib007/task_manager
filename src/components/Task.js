import React from 'react';
import {Button, Card, Col} from "antd";
import moment from 'moment';
import {EditOutlined, DeleteOutlined, EyeOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import classes from './Task.css';

export default function Task(props) {
    const isOverDue = moment().isAfter(props.task.dueDate);

    const styles = isOverDue ? {margin:4} : {margin:4};

    function handleResolveClick(task){
        props.onResolveClick(task);
    }

    return (
        <Col span={4}>
            <Card loading={props.isLoading}
                  hoverable
                  title={props.task.name}
                  style={styles}
                  className={classes.cardShadow}
                  actions={[
                      <EyeOutlined key="view" onClick={() => props.onViewClick(props.task._id)}/>,
                      <EditOutlined key="edit" onClick={() => props.onEditClick(props.task)}/>,
                      <DeleteOutlined key="delete" onClick={() => props.onDeleteClick(props.task)}/>,
                  ]}
            >
                <h2 style={{textAlign: "center"}}>{props.task?.category?.name}</h2>
                <p style={{textAlign: "center"}}>Due On: {moment(props.task.dueDate).format('D-MMM-Y')}</p>
                <br/>
                <Button block type={isOverDue ? 'danger' : 'primary'}
                        onClick={()=>handleResolveClick(props.task)}
                >{isOverDue ? 'Over Due' : 'Resolve'}</Button>
                <p style={{textAlign: "center"}}>Created On: {moment(props.task.createdAt).format('D-MMM-Y')}</p>
            </Card>
        </Col>
    );
}