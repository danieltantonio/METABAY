import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux';

function Profile(props) {
    const { web3, store, user } = props;
    const { address } = useParams();
    const [totalItemsOwned, setTotalItemsOwned] = useState(0);
    const [items, setItems] = useState([]);

    useEffect(() => {
        if(store && user) {
            (async () => {
                try {
                    const itemsOwned = await store.methods.returnItemsOwnedTotal(address).call();
                    setTotalItemsOwned(itemsOwned);
                    
                    if(itemsOwned) {
                        const allItems = [];
                        for(let i = 0; i < itemsOwned; i++) {
                            const res = await store.methods.returnItemsOwnedByAddress(address, i).call();
                            allItems.push(res);
                        }

                        setItems([...items, ...allItems]);
                    }
                } catch(err) {
                    alert('There was an error. Please read console.');
                    console.log(err);
                }
            })();
        }
    }, [user]);

    return(
        <div className="Profile">
            <h2>Profile {address}</h2>
            <h3>Items for Sale:</h3>
            <p>Total Items Owned: {totalItemsOwned}</p>
            {
                !items.length
                ?
                <div>This user does not sell anything</div>
                :
                items.map(itm => <Link to={`/item/${itm}`}>{itm}</Link>)
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

export default connect(mapStateToProps, {})(Profile);