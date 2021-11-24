import { combineReducers } from 'redux';

import { fetchWeb3 } from './getWeb3Reducer';
import { fetchStore } from './fetchStoreReducer';
import { handleItems } from './itemsReducer';

export default combineReducers({
    fetchWeb3,
    fetchStore,
    handleItems,
});