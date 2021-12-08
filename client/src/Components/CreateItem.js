import React, { useState } from 'react';

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
        const { name, value, type, files } = e.target;
        
        if(type === 'number') {
            setForm({ ...form, [name]: parseInt(value) });
        } else if (type === 'file') {
            setForm({ ...form, [name]: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        createItem(form);
    }
    
    return(
        <div>
            Create Item
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="name" onChange={changeForm}/>
                <input type="text" name="price" placeholder="price" onChange={changeForm}/>
                <input type="number" name="quantity" placeholder="quantity" onChange={changeForm}/>
                <input type="file" name="itemPic" placeholder="thumbnail" onChange={changeForm} />
                <input type="submit" />
            </form>
        </div>
    )
}

export default CreateItem;