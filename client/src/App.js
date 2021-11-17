import React, { useState, useEffect } from "react";
import StoreContract from "./contracts/Store.json";
import getWeb3 from "./getWeb3";
import { Routes, Route, NavLink } from 'react-router-dom';

import "./App.css";

import Home from './Components/Home';
import CreateItem from './Components/CreateItem';
import Item from './Components/Item';

function App(props) {
  const [web3, setWeb3] = useState(null);
  const [owner, setOwner] = useState(null);
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [Store, setStore] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const web3API = await getWeb3();
        const netID = await web3API.eth.net.getId();
        
        const deployedStore = StoreContract.networks[netID];
  
        setStore(new web3API.eth.Contract(
          StoreContract.abi,
          deployedStore && deployedStore.address
        ));
  
        setWeb3(web3API);
        setAccounts(await web3API.eth.getAccounts());
      } catch(err) {
        alert('Failed to loab web3.');
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if(web3) {
        try {
          const getOwner = await Store.methods.returnOwner().call();
          const getUser = web3.currentProvider.selectedAddress;
          setOwner(getOwner);
          setUser(getUser);
        } catch(err) {
          console.log(err);
        }
      }
    })();
  }, [web3]);

  const createItem = async data => {
    try {
      const { name, price, quantity } = data;
      const newItem = await Store.methods.createItem(name, web3.utils.toWei(price, 'ether'), quantity).send({ from: user });
      const itemAddr = newItem.events.ItemEvent.returnValues._itemAddress;

      setItems([...items, itemAddr]);
    } catch(err) {
      alert('There was an error creating new item. Please try again or read console.');
      console.log(err);
    }
  }

  window.ethereum.on('accountsChanged', accs => {
    setUser(accs[0]);
  });

  return (
    <div className="App">
      <div>
        User: {user}
        <NavLink to="/">Home</NavLink>
        <NavLink to="/new-item">Create Item For Sale</NavLink>
      </div>
      <Routes>
        <Route exact path="/" element={<Home items={items} />} />
        <Route path="/new-item" element={<CreateItem createItem={createItem} />} />
        <Route path="/item/:id" element={<Item web3={web3} user={user} />} />
      </Routes>
    </div>
  )
}

export default App;
