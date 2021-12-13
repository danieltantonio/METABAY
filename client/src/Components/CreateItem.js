import React, { useState } from 'react';
import {
    Form,
    Input,
    Upload,
    Button
} from 'antd';

const initForm = {
    name: '',
    price: 0,
    quantity: 0,
    itemPic: null,
}

function CreateItem(props) {
    const { createItem } = props;
    const [form, setForm] = useState(initForm);

    const changeForm = e => {
        const { name, value, type } = e.target;
        
        if(type === 'number') {
            setForm({ ...form, [name]: parseInt(value) });
        } else {
            setForm({ ...form, [name]: value });
        }
    }

    const handleUpload = e => {
        const { file } = e;
        setForm({ ...form, itemPic: file['originFileObj'] });
    }

    const handleSubmit = e => {
        e.preventDefault();
        createItem(form);
    }
    
    return(
        <div id="create-item">
            Create Item
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                initialValues={{ size: 'default' }}
                size="default"
            >
                <Form.Item label="Item Name">
                    <Input type="text" name="name" onChange={changeForm} />
                </Form.Item>
                <Form.Item label="Price">
                    <Input type="text" name="price" onChange={changeForm}/>
                </Form.Item>
                <Form.Item label="Quantity">
                    <Input type="number" name="quantity" onChange={changeForm}/>
                </Form.Item>
                <Form.Item label="Picture">
                    <Upload  name="itemPic" onChange={handleUpload}>
                        <Button>Upload</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button onClick={handleSubmit}>Create Item</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default CreateItem;