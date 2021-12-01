export const ADD_NEW_ITEM = 'ADD_NEW_ITEM';
export const ADD_NEW_ITEM_SUCC = 'ADD_NEW_ITEM_SUCC';
export const ADD_NEW_ITEM_ERR = 'ADD_NEW_ITEM_ERR';

export const addNewItem = (store, user, item) => {
    return dispatch => {
        (async () => {
            try {
                dispatch({ type: ADD_NEW_ITEM });
                const newItem = await store.methods.createItem(item.name, item.price, item.quantity).send({ from: user });
                const address = newItem.events.ItemEvent.returnValues._itemAddress;

                dispatch({ type: ADD_NEW_ITEM_SUCC, payload: address });
            } catch(err) {
                dispatch({ type: ADD_NEW_ITEM_ERR, payload: err });
            }
        })();
    }
}