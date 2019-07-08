import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

const homepageInitialState = {
    authorization: "",
    profile_id_pw: null,
    profile_user: null,

    load : 0,
    loading: false,
    
};

const homepage = (state = homepageInitialState, action) => {
    switch (action.type) {

        case 'AUTHENTICATE': {
            return Object.assign({}, state, {
                authorization: window.atob(action.auth)
            })
        }
         
        case 'SIGN_OUT': {
            return homepageInitialState //go back to initial state when sign out
        }
        case 'CHANGE_URL': {
            window.location.pathname = action.path
            return state
        }
        case 'SET_STATE': {
            return Object.assign({}, state, {
                authorization: action.state.authorization,
                profile_id_pw: action.state.profile_id_pw,
                profile_user: action.state.profile_user,
                
                load : action.state.load,
                loading: action.state.loading,
                
            })
        }
       
        default: {
            return state
        }
   }
}

const homepageApp = homepage // If there are at least two reducers, use 'combineReducers' instead of this code.
export default homepageApp
