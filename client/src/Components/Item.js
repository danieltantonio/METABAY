import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { Form, Input, Button } from 'antd';

import ItemContract from '../contracts/Item.json';

const initItemInfo = {
    name: '',
    price: '',
    quantity: 0
}

const initForm = {
    firstName: '',
    lastName: '',
    address: '',
    apartment: null,
    city: '',
    country: '',
    state: '',
    zip: '',
    phone: null,
    quantity: 0,
}

function Item(props) {
    const { web3, user, store } = props;
    const { id } = useParams();
    const [Item, setItem] = useState(null);
    const [itemInfo, setItemInfo] = useState(initItemInfo);
    const [form, setForm] = useState(initForm);
    const [pic, setPic] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const getPicData = await axios.get(`http://localhost:5000/item?address=${id}`);
                const picData = getPicData.data;

                setPic(picData.pic.picName);
            } catch(err) {
                console.log(err);
                alert('There was an error retrieving picture. Check connsole.');
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if(web3) {
                const itemClass = new web3.eth.Contract(
                    ItemContract.abi,
                    id
                );

                setItem(itemClass);
            }
        })();
    }, [web3]);

    useEffect(() => {
        if(Item) {
            (async () => {
                try {
                    const name = await Item.methods.returnName().call();
                    const price = await Item.methods.returnPrice().call();
                    const quantity = await Item.methods.returnQuantity().call();

                    const itemInfoObj = { name, price, quantity };

                    setItemInfo(itemInfoObj);
                } catch(err) {
                    alert('There was an error getting the item. Read the console.')
                    console.log(err);
                }
            })();
        }
    }, [Item]);

    const orderNow = async e => {
        e.preventDefault();
        try {
            const { quantity } = form;
            const { price } = itemInfo;

            const itemIndex = parseInt(await store.methods.returnItemIndex(id).call());
            const totalPurchases = await store.methods.returnItemPurchases(itemIndex).call();

            const order = {
                orderIndex: totalPurchases,
                itemAddress: id,
                customerWalletAddress: user,
                orderStatus: 'Ordered',
                ...form
            }

            await Item.methods.pay(quantity).send({ value: (price * quantity), from: user });
            await axios.post('http://localhost:5000/order', order);

            alert('Your order has been made, thank you!');
        } catch(err) {
            alert('ERROR CHECK CONSOLE');
            console.log(err);
        } 
    }

    const changeForm = e => {
        const { name, value, type } = e.target;
        if(type === "text") {
            setForm({ ...form, [name]: value });
        } else {
            setForm({ ...form, [name]: parseInt(value) });
        }
    }

    return(
        !itemInfo.name
        ?
        <div>Loading</div>
        :
        <div id="item">
            <div id="item-details">
                <h2>{itemInfo.name}</h2>
                { pic ? <img src={`http://localhost:5000/static/images/items/${id}/${pic}`} /> : <p>Picture loading</p> }
                <p>Price: ETH {web3.utils.fromWei(itemInfo.price, 'ether')}</p>
                <p>Quantity: {itemInfo.quantity}</p>
            </div>
            <div id="order-form">
                <Form
                    layout="horizontal"
                    initialValues={{ size: "default" }}
                    wrapperCol={{ size: 100 }}
                >
                    <Form.Item>
                        <Input type="text" onChange={changeForm} value={form.firstName} name="firstName" placeholder="First Name" />
                    </Form.Item>
                    <Form.Item>
                        <Input type="text" onChange={changeForm} value={form.lastName} name="lastName" placeholder="Last Name" />
                    </Form.Item>
                    <Form.Item>
                        <Input type="text" onChange={changeForm} value={form.address} name="address" placeholder="Address" />
                    </Form.Item>
                    <Form.Item>
                        <Input type="text" onChange={changeForm} value={form.apartment} name="apartment" placeholder="Apartment, suite, etc. (optional)" />
                    </Form.Item>
                    <Form.Item>
                        <Input type="text" onChange={changeForm} value={form.city} name="city" placeholder="City" />
                    </Form.Item>
                    <Form.Item>
                        <Input type="text" onChange={changeForm} value={form.country} name="country" placeholder="Country" />
                    </Form.Item>
                    <Form.Item>
                        <Input type="text" onChange={changeForm} value={form.state} name="state" placeholder="State" />
                    </Form.Item>
                    <Form.Item>
                        <Input type="text" onChange={changeForm} value={form.zip} name="zip" placeholder="Zip Code" />
                    </Form.Item>
                    <Form.Item>
                        <Input type="text" onChange={changeForm} value={form.phone} name="phone" placeholder="Phone" />
                    </Form.Item>
                    <Form.Item>
                        <Input type="number" onChange={changeForm} value={form.quantity} name="quantity" placeholder="Quantity" />
                    </Form.Item>
                    <Button onClick={orderNow}>Order</Button>
                </Form>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        web3: state.fetchWeb3.web3,
        store: state.fetchStore.store,
    }
}

export default connect(mapStateToProps, { })(Item);