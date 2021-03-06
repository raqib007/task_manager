import React, {createContext, useEffect, useState, useRef, useContext} from 'react';
import {Row, Col,Card, Form, Input, Button, message, Table, Popconfirm, Modal} from "antd";
import {DeleteTwoTone,EditTwoTone} from '@ant-design/icons';
import './css/category.css';

const EditableContext = createContext(null);


const EditableRow = ({index, ...props}) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
                          title,
                          editable,
                          children,
                          dataIndex,
                          record,
                          handleSave,
                          ...restProps
                      }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({...record, ...values});
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save}/>
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const baseUrl = "https://node-task-manager-backend.herokuapp.com/api/";

export default class EditableTable extends React.Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'categories',
                dataIndex: 'name',
                width: "60%",
                editable: true
            },
            {
                title: 'operation',
                dataIndex: 'operation',
                render: (_, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <>
                        <Button type="default" title="Edit" onClick={()=> this.handleEdit(record)}><EditTwoTone /></Button>&nbsp;
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record)}>
                            <a href="/#"><Button type="default" title="Delete"><DeleteTwoTone /></Button></a>
                        </Popconfirm>
                        </>
                    ) : null,
            },
        ];
        this.state = {
            dataSource: [],
            count: 0,
            isLoading: false,
            modal2Visible: false,
            editMode: null
        };
    }

    componentDidMount() {
        this.setState({isLoading: true});
        this.fetchCategory();
    }

    fetchCategory = ()=>{
        fetch(baseUrl + 'category')
            .then(response => response.json())
            .then(data => {
                if (data) {
                    console.log(data);
                    this.setState({dataSource: data.map((d, index) => ({key: index, ...d})), count: data.length})
                    this.setState({isLoading: false});
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({isLoading: false});
            });
    }

    handleEdit = (record) => {
       console.log(record);
       console.log(this.formRef);
       if(this.formRef.current !== null){
           this.setState({editMode:record});
           this.formRef.current.setFieldsValue({
               category: record.name,
           });
           this.setModal2Visible(true);
       }

    }

    handleDelete = (record) => {
        console.log(record);
        fetch(baseUrl + 'category/' + record._id, {
            method: "delete"
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                message.success(data.message);
                const dataSource = [...this.state.dataSource];
                this.setState({
                    dataSource: dataSource.filter((item) => item.key !== record.key),
                });
            })
            .catch(error => {
                console.log(error)
                message.error('Error Occured!');
            });

    };

    handleAdd = () => {
        this.setModal2Visible(true);
    };

    handleSave = (row) => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {...item, ...row});
        this.setState({
            dataSource: newData,
        });
    };

    setModal2Visible(modal2Visible) {
        this.setState({ modal2Visible });
    }

    render() {
        const {dataSource} = this.state;
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };

        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });

        const onFinish = (values) => {
            console.log('Success:', values);

            this.setState({isLoading: true});
            if(this.state.editMode !== null){
                fetch(baseUrl + 'category/'+this.state.editMode._id, {
                    method: "put",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({name:values.category})
                })
                    .then(response => response.json())
                    .then(data => {
                        this.setState({isLoading: false});
                        message.success('Category update success');
                        this.setModal2Visible(false);
                        this.fetchCategory();
                    })
                    .catch(error => {
                        this.setState({isLoading: false});
                        message.success('Category update failed');
                        console.log(error);
                    });
            }else{
                fetch(baseUrl + 'category', {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({name:values.category})
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data) {
                            console.log(data);
                            this.setState({isLoading: false});

                            const {count, dataSource} = this.state;
                            const newData = {
                                key: count,
                                _id: data.data._id,
                                name: data.data.name
                            };

                            this.setState({
                                dataSource: [...dataSource, newData],
                                count: count + 1,
                            });

                            message.success('Category add success');
                            this.setModal2Visible(false);
                        }
                    })
                    .catch(error => {
                        this.setState({isLoading: false});
                        message.error('An error occurred while category');
                    });
            }


        };

        const onFinishFailed = (errorInfo) => {
            console.log('Failed:', errorInfo);
            message.error('Field can not be empty!');
        };

        const onModalClose = () =>{
            if(this.state.editMode !== null){
                console.log('resetting');
                this.formRef.current.resetFields();
                this.setState({editMode:null});
            }
        }

        return (
            <>
                <Row>
                    <Col lg={{span:16,offset:4}} md={{span:20,offset:2}} sm={{span:22, offset:1}} xs={{span:24}}>
                        <Card style={{overflowY:'scroll',height: "calc( 100vh - 142px)"}}>
                        <div>
                            <Button
                                onClick={this.handleAdd}
                                type="primary"
                                style={{
                                    marginBottom: 16,
                                }}
                            >
                                Add Category
                            </Button>
                            <Table

                                components={components}
                                rowClassName={() => 'editable-row'}
                                bordered
                                dataSource={dataSource}
                                columns={columns}
                                loading={this.state.isLoading}
                            />
                        </div>
                        </Card>
                    </Col>
                </Row>
                <Modal
                    title={this.state.editMode !== null ? 'Edit Category' : 'Add new category'}
                    centered
                    forceRender={true}
                    visible={this.state.modal2Visible}
                    afterClose={onModalClose}
                    onCancel={() => this.setModal2Visible(false)}
                    okButtonProps={{style:{display:"none"}}}
                >
                    <Form
                        {...layout}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        ref={this.formRef} name="control-ref"
                    >
                        <Form.Item
                            label="Category"
                            name="category"
                            rules={[{ required: true, message: 'Please enter category!' }]}
                        >
                            <Input placeholder="Category"/>
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button type="primary" loading={this.state.isLoading} htmlType="submit">
                                {this.state.editMode !== null ? 'Update' : 'Save'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        );
    }
}