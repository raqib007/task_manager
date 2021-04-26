import React from 'react';
import {Button, Card, Col} from "antd";
import moment from 'moment';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';

export default function Task(props) {
    return (
        <Col span={4}>
            <Card loading={props.isLoading}
                  hoverable
                  title={props.task.name}
                  style={{margin: 4,borderColor:'#1890ff'}}
                  actions={[
                      <EditOutlined key="edit" onClick={() => props.onEditClick(props.task)}/>,
                      <DeleteOutlined key="delete" onClick={() => props.onDeleteClick(props.task)}/>,
                  ]}
            >
                <h2 style={{textAlign: "center"}}>{props.task?.category?.name}</h2>
                <p style={{textAlign: "center"}}>Due On: {moment(props.task.dueDate).format('D-MMM-Y')}</p>
                <br/>
                <Button block type="primary">Resolve</Button>
                <p style={{textAlign: "center"}}>Created On: {moment(props.task.createdAt).format('D-MMM-Y')}</p>
            </Card>
        </Col>
    );
}