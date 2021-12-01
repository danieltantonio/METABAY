import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

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
                </div>
            )
        }));
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