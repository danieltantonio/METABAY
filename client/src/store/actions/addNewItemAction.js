import axios from 'axios';
import formData from 'form-data';

export const ADD_NEW_ITEM = 'ADD_NEW_ITEM';
export const ADD_NEW_ITEM_SUCC = 'ADD_NEW_ITEM_SUCC';
export const ADD_NEW_ITEM_ERR = 'ADD_NEW_ITEM_ERR';

export const addNewItem = (store, user, item, itemPic) => {
    return dispatch => {
        (async () => {
            try {
                dispatch({ type: ADD_NEW_ITEM });
                const newItem = await store.methods.createItem(item.name, item.price, item.quantity).send({ from: user });
                const address = newItem.events.ItemEvent.returnValues._itemAddress;
                const fd = new formData();
                
                fd.append('item', address);
                fd.append('file', itemPic, itemPic.name);

                await axios.post('http://localhost:5000/item', fd);
                dispatch({ type: ADD_NEW_ITEM_SUCC, payload: address });
            } catch(err) {
                dispatch({ type: ADD_NEW_ITEM_ERR, payload: err });
            }
        })();
    }
}