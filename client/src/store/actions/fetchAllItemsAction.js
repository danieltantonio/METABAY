export const FETCH_ITEMS = 'FETCH_ITEMS';
export const FETCH_ITEMS_SUCC = 'FETCH_ITEMS_SUCC';
export const FETCH_ITEMS_ERR = 'FETCH_ITEMS_ERR';

export const fetchAllItems = store => {
    return dispatch => {
        (async () => {
            try {
                dispatch({ type: FETCH_ITEMS });
                const totalItems = parseInt(await store.methods.returnIndex().call());
    
                if(totalItems) {
                    const allItemsInStore = [];
                    for(let i = 0; i < totalItems; i++) {
                        const item = await store.methods.returnItemAtIndex(i).call();
                        allItemsInStore.push(item);
                    }
    
                    dispatch({ type: FETCH_ITEMS_SUCC, payload: allItemsInStore });
                } else {
                    dispatch({ type: FETCH_ITEMS_SUCC, payload: [] });
                }
            } catch(err) {
                console.log('ERROR, CHECK PAYLOAD');
                dispatch({ type: FETCH_ITEMS_ERR, payload: err });
            }
        })();
    }
}