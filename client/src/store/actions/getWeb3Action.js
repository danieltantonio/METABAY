import getWeb3 from "../../getWeb3";

export const FETCH_WEB3 = 'FETCH_WEB3';
export const FETCH_WEB3_SUCC = 'FETCH_WEB3_SUCC';
export const FETCH_WEB3_ERR = 'FETCH_WEB3_ERR';

export const fetchWeb3 = e => {
    return dispatch => {
        (async () => {
            dispatch({ type: FETCH_WEB3 });
            try {
                const web3 = await getWeb3();
                dispatch({ type: FETCH_WEB3_SUCC, payload: web3 });
            } catch(err) {
                dispatch({ type: FETCH_WEB3_ERR, payload: err });
            }
        })();
    }
}