import React from 'react';
import {Upload, Button} from "antd";
import {UploadOutlined} from '@ant-design/icons';

export default function TaskAttachment(props){


    return(
        <Upload
            action={`https://node-task-manager-backend.herokuapp.com/api/upload/${props.taskid}`}
            listType="picture"
            defaultFileList={[...props.fileList]}
            customRequest={props.onFileUpload}
            onRemove={props.onRemoveFile}
        >
            <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
    );
}