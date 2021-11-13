import React, { useState, useEffect } from "react";
import StoreContract from "./contracts/Store.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const initForm = {
  itemName: '',
  price: 0,
  quantity: 0
}

function App(props) {
  const [web3, setWeb3] = useState(null);
  const [owner, setOwner] = useState(null);
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [Store, setStore] = useState(null);
  const [form, setForm] = useState(initForm);

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
          setOwner(getOwner);
          setUser(web3.currentProvider.selectedAddress);
        } catch(err) {
          console.log(err);
        }
      }
    })();
  }, [web3]);

  const changeForm = e => {
    const { name, value, type } = e.target;

    if(type !== 'number') {
      setForm({ ...form, [name]: value }); 
    } else {
      const numVal = parseInt(value);
      setForm({ ...form, [name]: numVal });
    }
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const { itemName, price, quantity } = form;
    const res = await Store.methods.createItem(itemName, price, quantity).send({ from: user });

    console.log(res);
  }

  window.ethereum.on('accountsChanged', accs => {
    setUser(accs[0]);
  });

  return (
    <div>
      <img src="./1635911403779.jpg" />
      {
        web3 
        &&
        <div>
          <form onSubmit={handleSubmit}>
            <p>Name</p>
            <input type="text" name="itemName" value={form.itemName} onChange={changeForm}/>
            <p>Cost</p>
            <input type="number" name="price" value={form.price} onChange={changeForm}/>
            <p>Quantity</p>
            <input type="number" name="quantity" value={form.quantity} onChange={changeForm}/>
            <input type="submit" />
          </form>
        </div> 
      }
    </div>
  )
}

export default App;
