import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Route, Routes, NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import formData from 'form-data';

import { fetchWeb3, fetchStore, fetchAllItems, addNewItem } from './store/actions';

import Home from './Components/Home';
import CreateItem from './Components/CreateItem';
import Item from './Components/Item';
import Profile from './Components/Profile';
import Orders from './Components/Orders';

function App(props) {
  const { fetchWeb3, fetchStore, fetchAllItems, addNewItem, web3, store, items } = props;
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchWeb3();
  }, []);

  useEffect(() => {
    if(web3) fetchStore(web3);
  }, [web3]);

  useEffect(() => {
    if(store) fetchAllItems(store);
  }, [store]);

  useEffect(() => {
    if(web3) {
      (async () => {
        const getUser = web3.currentProvider.selectedAddress;
        setUser(getUser);
      })();
    }
  }, [web3]);

  window.ethereum.on('accountsChanged', accs => {
    setUser(accs[0]);
  });

  const createItem = async item => {
    if(store && user && web3) {
      try {
        const { name, price, quantity, itemPic } = item;
        const priceToWei = web3.utils.toWei(price, 'ether');
        const newItem = { name, price: priceToWei, quantity };
  
        addNewItem(store, user, newItem, itemPic);
      } catch(err) {
        console.log(err);
        alert('Error creating a new Item. Read the console.');
      }
    }
  }

  return (
    <div>
      <div>
        User: <Link to={`/${user}`}>{user}</Link>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/new-item">Create Item For Sale</NavLink>
        <NavLink to="/orders">Orders</NavLink>
      </div>
      <Routes>
        <Route exact path="/" element={ <Home items={items} /> } />
        <Route exact path="/:address" element={ <Profile user={user} /> } />
        <Route path="/new-item" element={ <CreateItem createItem={createItem} /> } />
        <Route path="/item/:id" element={ <Item user={user} /> } />
        <Route path="/Orders" element={ <Orders user={user} /> } />
      </Routes>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    web3: state.fetchWeb3.web3,
    store: state.fetchStore.store,
    items: state.handleItems.items
  }
}

export default connect(mapStateToProps, { fetchWeb3, fetchStore, fetchAllItems, addNewItem })(App);