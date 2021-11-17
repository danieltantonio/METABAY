import React, { useState } from 'react';

const initForm = {
    name: '',
    price: 0,
    quantity: 0,
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
                <input type="submit" />
            </form>
        </div>
    )
}

export default CreateItem;