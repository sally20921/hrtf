export const showNavBar = () => {
  return{
    type: 'NAV_BAR',
  }
}

// When the user inputs username, password and clicks the 'Sign In' button, this action is invoked and Saga requests GET to 'auth' in backend page.
export const signIn = (username, password) => {
    return {
        type: 'SIGN_IN',
        username,
        password
    }
}

export const SIGN_IN = 'SIGN_IN'

// When the user is authenticated and succeeds to sign in, this action is invoked by Saga and reducer stores the user's authorization to its state.
export const authenticate = (auth) => {
    return {
        type: 'AUTHENTICATE',
        auth
    }
}
export const AUTHENTICATE = 'AUTHENTICATE'

// When the user enters username, password and pwdverification and clicks the '회원가입', this action is invocked and Saga requests POST to 'User List' in backend page.
export const postSignUp = (username, password) => {
    return {
        type: 'POST_SIGN_UP',
        username,
        password
    }
}
export const POST_SIGN_UP = 'POST_SIGN_UP'

//When the user clicks the 'Sign Out' button, this action is invoked
export const signOut = () => {
    return {
       type: 'SIGN_OUT',
    }
}
export const SIGN_OUT = 'SIGN_OUT'


// Move to another page
export const changeUrl = (pathname) => {
    return {
        type: 'CHANGE_URL',
        path: pathname,
    }
}
export const CHANGE_URL = 'CHANGE_URL'

export const setState = (state) => {
    return {
        type: 'SET_STATE',
        state: state
    }
}
export const SET_STATE = 'SET_STATE'


export const gotoSignUpPage = () => {
    return {
        type: 'GOTO_SIGN_UP',
    }
}
export const GOTO_SIGN_UP = 'GOTO_SIGN_UP'


export const toProfile = (profile_user) =>{
    return {
        type: 'TO_PROFILE',
        profuser: profile_user,
    }
}
export const TO_PROFILE = 'TO_PROFILE'

export const toChangeIntro = (user,name,belong,intro, removeImg, changeImg, img)=>{
    return {
         type: 'TO_INTRO_CHANGE',
         user: user,
         myname: name,
         mybelong: belong,
         myintro: intro,
         removeImg: removeImg,
         changeImg: changeImg,
         img: img
    }
}
export const TO_INTRO_CHANGE = 'TO_INTRO_CHANGE'

export const toChangePW = (profile_user, oldpw, newpw) => {
    return {
        type: 'TO_PW_CHANGE',
        profuser: profile_user,
        oldpw : oldpw,
        newpw : newpw,
    }
}
export const TO_PW_CHANGE = 'TO_PW_CHANGE'

export const toEscape = (profile_user) => {
    return {
        type: 'TO_ESCAPE',
        profuser: profile_user,
    }
}
export const TO_ESCAPE = 'TO_ESCAPE'

export const toGiveAdmin = (groupid, userid) => {
    console.log("giveAdmin action groupid: ", groupid, " userid: ", userid)
    return {
        type: 'GIVE_ADMIN',
        groupid: groupid,
        userid: userid,
    }
}
export const GIVE_ADMIN = 'GIVE_ADMIN'

