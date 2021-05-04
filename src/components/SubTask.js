import React from 'react';
import {DeleteTwoTone, EditTwoTone, CheckCircleTwoTone, CloseCircleTwoTone} from "@ant-design/icons";
import {Button, Checkbox, Input} from "antd";

export default function SubTask(props) {
    const [edit, setEdit] = React.useState(false);
    const styles = props.stask.status === true ? { textDecorationLine: 'line-through' } : { textDecorationLine: 'none' };

    React.useEffect(()=>{
        if(!('id' in props.stask)){
            setEdit(true);
        }
    },[])

    return (
        <tr>
            <td>
                {props.sl}.   <Checkbox checked={props.stask.status}
                                        onChange={(e)=>props.onSubTaskCheckChange(props.stask)}
            />&nbsp;
            </td>
            <td style={{width: "60%"}}>
                {edit ? (<Input value={props.stask.name}
                                onChange={(e) => props.onSubtaskChange(e, props.stask)}/>) : <span style={styles}>{props.stask.name}</span>}
            </td>
            <td>{edit && (<>
            <Button onClick={() => {
                setEdit(false);
                props.onEditSubTask(props.stask)
            }}>
                <CheckCircleTwoTone/>
            </Button>
            <Button onClick={() => setEdit(false)}>
                <CloseCircleTwoTone/>
            </Button>
            </>)
            }
                {!edit && <Button onClick={() => {
                    setEdit(true);
                }}>
                    <EditTwoTone key={"Edit"}/>
                </Button>}
                <Button onClick={() => props.onDeleteSubTask(props.stask)}><DeleteTwoTone key={"Delete"}/></Button>
            </td>
        </tr>
    );
}