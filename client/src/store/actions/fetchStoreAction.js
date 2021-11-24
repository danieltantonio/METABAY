import StoreContract from '../../contracts/Store.json';

export const FETCH_STORE = 'FETCH_STORE';
export const FETCH_STORE_SUCC = 'FETCH_STORE_SUCC';
export const FETCH_STORE_ERR = 'FETCH_STORE_ERR';

export const fetchStore = (web3) => {
    return dispatch => {
        (async () => {
            try {
                dispatch({ type: FETCH_STORE });
                
                const netID = await web3.eth.net.getId();
                const deployedStore = StoreContract.networks[netID];
    
                const store = new web3.eth.Contract(StoreContract.abi, deployedStore && deployedStore.address);
                dispatch({ type: FETCH_STORE_SUCC, payload: store });
            } catch(err) {
                console.log('ERROR ERROR ERROR', err);
                dispatch({ type: FETCH_STORE_ERR, payload: err });
            }
        })();
    }
}