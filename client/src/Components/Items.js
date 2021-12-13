import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';

const { Meta } = Card;

function Items(props) {
    const { items, store, web3 } = props;
    const [pics, setPics] = useState([]);

    useEffect(() => {
        if(items.length) {
            items.forEach(async address => {
                try {
                    const getPicData = await axios.get(`http://localhost:5000/item?address=${address}`);
                    const itemIndex = parseInt(await store.methods.returnItemIndex(address).call());
                    const itemName = await store.methods.returnItemName(itemIndex).call();
                    const itemPriceInWei = await store.methods.returnItemPrice(itemIndex).call();
                    const itemPrice = web3.utils.fromWei(itemPriceInWei, 'ether');
                    const picName = getPicData.data.pic.picName;
                    const picData = { address, picName, itemName, itemPrice }
                    setPics(oldArr => [...oldArr, picData]);
                } catch(err) {
                    console.log(address, err);
                    alert('There was an error getting Item Picture. Check the console.');
                }
            })
        }
    }, [items]);

    return (
        <div className="Items">
           {
               pics.length
               ?
               pics.map(pic => {
                   return (
                       <Link to={`/item/${pic.address}`}>
                            <Card
                             hoverable
                             style={{ width: 240 }}
                             cover={<img src={`http://localhost:5000/static/images/items/${pic.address}/${pic.picName}`} />}
                            >
                                <Meta title={pic.itemName} description={
                                    <div>
                                        <i class="fab fa-ethereum"></i> {pic.itemPrice}
                                    </div>
                                } />
                            </Card>
                       </Link>
                   )
               })
               :
               <p>No items yet</p>
           }
        </div>
    )
}

const mapStateToProps = state => {
    return {
        store: state.fetchStore.store,
        web3: state.fetchWeb3.web3
    }
}

export default connect(mapStateToProps, {})(Items);