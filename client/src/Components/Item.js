import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

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
        <div>
            <h2>{itemInfo.name}</h2>
            <p>Price: ETH {web3.utils.fromWei(itemInfo.price, 'ether')}</p>
            <p>Quantity: {itemInfo.quantity}</p>
            <form>
                <input type="text" onChange={changeForm} value={form.firstName} name="firstName" placeholder="First Name" />
                <input type="text" onChange={changeForm} value={form.lastName} name="lastName" placeholder="Last Name" />
                <input type="text" onChange={changeForm} value={form.address} name="address" placeholder="Address" />
                <input type="text" onChange={changeForm} value={form.apartment} name="apartment" placeholder="Apartment, suite, etc. (optional)" />
                <input type="text" onChange={changeForm} value={form.city} name="city" placeholder="City" />
                <input type="text" onChange={changeForm} value={form.country} name="country" placeholder="Country" />
                <input type="text" onChange={changeForm} value={form.state} name="state" placeholder="State" />
                <input type="text" onChange={changeForm} value={form.zip} name="zip" placeholder="Zip Code" />
                <input type="text" onChange={changeForm} value={form.phone} name="phone" placeholder="Phone" />
                <input type="number" onChange={changeForm} value={form.quantity} name="quantity" placeholder="Quantity" />
                <button onClick={orderNow}>Order Now</button> 
            </form>
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