import { FETCH_ITEMS, FETCH_ITEMS_ERR, FETCH_ITEMS_SUCC } from '../actions';
import { ADD_NEW_ITEM, ADD_NEW_ITEM_ERR, ADD_NEW_ITEM_SUCC  } from '../actions';

const initState = {
    items: [],
    err: '',
    isLoading: false,
}

export const handleItems = (state = initState, action) => {
    switch(action.type) {
        case FETCH_ITEMS:
            return {
                ...state,
                isLoading: true
            }
        case FETCH_ITEMS_SUCC:
            return {
                ...initState,
                items: action.payload
            }
        case FETCH_ITEMS_ERR:
            return {
                ...initState,
                err: action.payload
            }
        case ADD_NEW_ITEM:
            return {
                ...initState,
                isLoading: true
            }
        case ADD_NEW_ITEM_SUCC:
            return {
                ...initState,
                items: [ ...state.items, action.payload ]
            }
        case ADD_NEW_ITEM_ERR:
            return {
                ...initState,
                err: action.payload
            }
        default:
            return state
    }
}