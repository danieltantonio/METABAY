import { FETCH_STORE, FETCH_STORE_SUCC, FETCH_STORE_ERR } from '../actions';

const initState = {
    store: null,
    error: '',
    isLoading: false,
}

export const fetchStore = (state = initState, action) => {
    switch(action.type) {
        case FETCH_STORE:
            return {
                ...state,
                isLoading: true
            }
        case FETCH_STORE_SUCC:
            return {
                ...initState,
                store: action.payload
            }
        case FETCH_STORE_ERR:
            return {
                ...initState,
                error: action.payload
            }
        default:
            return state
    }
}