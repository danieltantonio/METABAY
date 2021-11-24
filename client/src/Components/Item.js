import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';

import ItemContract from '../contracts/Item.json';

const initItemInfo = {
    name: '',
    price: '',
    quantity: 0
}

function Item(props) {
    const { web3, user } = props;
    const { id } = useParams();
    const [Item, setItem] = useState(null);
    const [itemInfo, setItemInfo] = useState(initItemInfo);
    const [quantity, setQuantity] = useState(0);

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

    const changeQuant = e => {
        const { value } = e.target;
        setQuantity(value);
    }

    const orderNow = async e => {
        e.preventDefault();
        try {
            await Item.methods.pay(quantity).send({ from: user, value: (quantity * itemInfo.price) });
            const newQuantity = await Item.methods.returnQuantity().call();

            setItemInfo({ ...itemInfo, quantity: newQuantity });
        } catch(err) {
            alert('There was an error getting the item. Read the console.');
            console.log(err);
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
            <input placeholder="quantity" value={quantity} onChange={changeQuant} />
            <button onClick={orderNow}>Order Now</button> 
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