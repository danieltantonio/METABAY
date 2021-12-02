import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

function Orders(props) {
    const { web3, store, user } = props;
    const [orders, setOrders] = useState({});

    // Get Items for sale posted by user
    useEffect(() => {
        if(store && user) {
            (async () => {
                const getTotalItemsStr = await store.methods.returnItemsOwnedTotal(user).call();
                const getTotalItems = parseInt(getTotalItemsStr);
                const itemInfo = {};

                // If user is selling anything
                if(getTotalItems) {
                    for(let i = 0; i < getTotalItems; i++) {
                        const itemAddr = await store.methods.returnItemsOwnedByAddress(user, i).call();
                        const itemIndex = parseInt(await store.methods.returnItemIndex(itemAddr).call());
                        const totalPurchases = parseInt(await store.methods.returnItemPurchases(itemIndex).call());

                        // If anyone has purchased item
                        if(totalPurchases) {
                            for(let purchaseIndex = 0; purchaseIndex < totalPurchases; purchaseIndex++) {
                                const buyer = await store.methods.returnBuyerAddress(itemIndex, purchaseIndex).call();
                                const statusNum = parseInt(await store.methods.returnOrderStatus(itemIndex, purchaseIndex).call());
                                const orderIndex = await store.methods.returnPaymentIndex(itemIndex, purchaseIndex).call();
                                let status = '';

                                switch(statusNum) {
                                    case 0:
                                        status = 'Purchased';
                                        break;
                                    case 1:
                                        status = 'In-Transit';
                                        break;
                                    case 2:
                                        status = 'Delivered';
                                        break;
                                    default:
                                        status = 'Purchased';
                                }
                                
                                itemInfo[itemAddr] ? itemInfo[itemAddr].push({ buyer, status, orderIndex })  : itemInfo[itemAddr] = [{buyer, status, orderIndex}];
                            }

                            setOrders({ ...orders, ...itemInfo });
                        }
                    }
                }
            })();
        }
    }, [user]);

    const returnOrders = items => {
        return Object.keys(items).map(itm => items[itm].map(ordr => {
            return (
                <div key={ordr.orderIndex}>
                    <p>Item: {itm}</p>
                    <p>Customer: {ordr.buyer}</p>
                    <div id={`${itm}-${ordr.orderIndex}`}></div>
                    <button onClick={() => returnOrderDetails(itm, ordr.orderIndex)}>Customer Info</button>
                </div>
            )
        }));
    }

    const returnOrderDetails = async (item, order) => {
        try {
            const orderDataContainer = document.getElementById(`${item}-${order}`);

            if(!orderDataContainer.innerHTML) {
                const getOrderData = await axios.get(`http://localhost:5000/order?item=${item}&order=${order}`);
                const orderData = getOrderData.data;

                // Make HTML Elements
                const fName = document.createElement('p');
                const lName = document.createElement('p');
                const addr = document.createElement('p');
                const city = document.createElement('p');
                const state = document.createElement('p');
                const zip = document.createElement('p');
                const country = document.createElement('p');
                const quantity = document.createElement('p');

                // Populate HTML Elements with Order Data
                fName.innerHTML = `First Name: ${orderData.firstName}`;
                lName.innerHTML = `Last Name: ${orderData.lastName}`;
                addr.innerHTML = `Address: ${orderData.address}`;
                city.innerHTML = `City: ${orderData.city}`;
                state.innerHTML = `State: ${orderData.state}`;
                zip.innerHTML = `Zip Code: ${orderData.zip}`;
                country.innerHTML = `Country: ${orderData.country}`;
                quantity.innerHTML = `Quantity: ${orderData.quantity}`;

                // Append HTML Elements to Container
                orderDataContainer.appendChild(fName);
                orderDataContainer.appendChild(lName);
                orderDataContainer.appendChild(addr);
                orderDataContainer.appendChild(city);
                orderDataContainer.appendChild(state);
                orderDataContainer.appendChild(zip);
                orderDataContainer.appendChild(country);
                orderDataContainer.appendChild(quantity);
            } else {
                orderDataContainer.innerHTML = '';
            }
        } catch(err) {
            alert('There was an error! Check the console.');
            console.log(err);
        }
    }

    return(
        <div>
            <h2>Orders:</h2>
            {
                !Object.keys(orders).length
                ?
                <div>There are no on-going orders</div>
                :
                <div className="items">
                    {
                        returnOrders(orders)
                    }
                </div>
            }
        </div>
    )
}

const mapStateToProps = state => {
    return {
        web3: state.fetchWeb3.web3,
        store: state.fetchStore.store
    }
}

export default connect(mapStateToProps, {})(Orders);