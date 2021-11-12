import React, { useState, useEffect } from "react";
import SimpleStorageContract from "./contracts/TestStore.json";
import getWeb3 from "./getWeb3";

import "./App.css";

function App(props) {
  const [storageValState, setStorageVal] = useState(0);
  const [web3State, setWeb3] = useState(null);
  const [accountsState, setAccounts] = useState(null);
  const [contractState, setContract] = useState(null);
  const [ownerAddr, setOwnerAddr] = useState('');
  const [userAddr, setUserAddr] = useState('');
  const [sendETHAmount, setsendETHAmount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleStorageContract.networks[networkId];
        const instance = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork && deployedNetwork.address
        );
  
        setWeb3(web3);
        setAccounts(accounts);
        setContract(instance);

        console.log(accounts);
      } catch(err) {
        alert('Failed to load web3, accounts, or contract. Check console for details.');
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    if(contractState) {
      console.log(contractState.methods.sendMoney());
      contractState.methods.showOwner().call()
      .then(res => {
        setOwnerAddr(res);
      })
      .catch(err => {
        console.log(err);
      });

      web3State.eth.getAccounts()
      .then(res => {
        setUserAddr(res[0]);
      })
      .catch(err => {
        console.log(err);
      })
    }
  }, [contractState]);

  const sendETH = e => {
    e.preventDefault();
    // This method works
    // web3State.eth.sendTransaction({ to: ownerAddr, from: userAddr, value: web3State.utils.toWei(String(sendETHAmount), 'ether') });

    // See if I can get the solidity method to work
    contractState.methods.sendMoney().send({ from: userAddr, value: web3State.utils.toWei(String(sendETHAmount), 'ether') });
  }

  const onChangeETHAmnt = e => {
    setsendETHAmount(e.target.value);
  }

  return (
    <div>
      { 
        ownerAddr 
        && 
        <div>
          <p>Owner Wallet Address: {ownerAddr}</p>
          <p>Your Wallet Address: {userAddr}</p>
        </div>
      }
      <img src="./1635911403779.jpg" />
      <form onSubmit={sendETH}>
        <input name="ethAmount" type="text" onChange={onChangeETHAmnt} />
        <input type="submit" />
      </form>
    </div>
  )
}

export default App;
