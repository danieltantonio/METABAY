import { FETCH_WEB3, FETCH_WEB3_SUCC, FETCH_WEB3_ERR } from '../actions';

const initState = {
    web3: null,
    error: '',
    isLoading: false
}

export const fetchWeb3 = (state = initState, action) => {
    switch(action.type) {
        case FETCH_WEB3:
            return {
                ...state,
                isLoading: true
            }
        case FETCH_WEB3_SUCC:
            return {
                ...initState,
                web3: action.payload
            }
        case FETCH_WEB3_ERR:
            return {
                ...initState,
                error: action.payload
            }
        default:
            return state
    }
}