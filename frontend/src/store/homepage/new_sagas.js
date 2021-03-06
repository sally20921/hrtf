import { put, take, call, select, spawn } from 'redux-saga/effects'
import 'react-confirm-alert/src/react-confirm-alert.css';

import * as actions from './../../actions/index'


var xhr = require('xhr-promise-redux');

const front_url = "http://localhost:3000";
const fixed_url = "http://localhost:8000/";
const auth_check_url = fixed_url+'auth/';

// 이제 backend에서 사용하는 url은 모두 'path_name/'의 형식을 따르고, frontend에서 사용하는 url은 모두 '/path_name/'의 형식을 따릅니다.

// localStorage: 현재 사용하고 있는 브라우저 상에 스테이트를 저장하는데 사용.
// 무려 크롬을 종료했다 시작해도 정보가 저장되어 있어요!
// state의 경우 현재 페이지에서만 유지됩니다. (다른 페이지로 이동 시 리셋되기 때문에 새로 스테이트를 세팅해줘야 합니다. - 이 기능을 하는게 watchLoginState)
// localStorage에 들어갈 정보
//   1. "auth" - 아이디 및 비밀번호 (Base64로 encoding된 버전)
//   2. "parent" - articleDetailPage에서 원글 확인 & writePage에서 댓글 / 일반 포스팅 구분을 위한 parent article의 id
// localStorage의 정보를 넣기/가져오기/삭제하기
//      (1) 가져오기: localStorage.getItem('data_name') / localStorage['data_name']
//      (2) 넣기: localStorage.setItem('data_name', data) / localStorage['data_name'] = data
//      (3) 삭제하기: localStorage.removeItem('data_name')
const localStorage = window.localStorage;


// saga: 미들웨어에서 돌아갈 함수
export default function *saga() {
    const path = window.location.pathname;
    console.log("pathname: ", window.location.pathname)
    switch(window.location.pathname) {
        case '/':
            yield spawn(mainPageSaga);
            break;
        case '/log_in/':
            yield spawn(loginPageSaga);
            break;
        case '/main/':
            yield spawn(loggedInMainPageSaga);
            break;
        case '/sign_up/':
            yield spawn(signUpPageSaga);
            break;
        default:
            const url = path.split("/");
            switch(url[1]) {
                case 'profile':
                    yield spawn(profilePageSaga);
                    break;
                default:
                    console.log("default state");
                    alert("없는 장소입니다.");
                    if(localStorage.getItem("auth") === null) {
                        // localStorage.removeItem('parent');
                        yield put(actions.changeUrl('/'));
                    } else {
                        // localStorage.removeItem('parent');
                        yield put(actions.changeUrl('/main/'));
                    }
            }
    }
}


///// Page별 saga함수
// 여러 기능들을 한 함수에 묶어서 saga함수에 추가할 때 예쁘게 추가하는 용도
//////////////////////////////////////////////////
// Page별 saga함수 작성 규칙
// 1. 페이지명을 포함하는 직관적인 이름의 함수를 정의한다.
//   (ex. 로그인 페이지를 작성할 경우 loginPageSaga)
// 2. 페이지의 url을 예쁘게(<<<<<중요>>>>>) 정의한다.
//   (좋은 예: 메인 페이지의 url - '/main/', 나쁜 예: 메인 페이지의 url - '/sogaewonsil_real_geukhyum/')
// 3. switch문의 케이스에 추가한다.
//   (ex. 메인페이지 추가 - case '/main/': yield spawn(mainPageSaga); break;)
// 4. 페이지 이동은 yield put(actions.changeUrl('/target_path/'))를 이용하시면 됩니다.
//////////////////////////////////////////////////
function *loginPageSaga() {
    console.log("Login Page Saga");
    yield spawn(watchLoginState);
    yield spawn(watchSignIn);
    yield spawn(watchSignUp);
}

function *signUpPageSaga() {
    console.log("Sign Up Page Saga")
    yield spawn(watchLoginState);
    yield spawn(watchPostSignUp);
}

function *mainPageSaga() {
    console.log("Main Page Saga");
    yield spawn(watchLoginState);
    yield spawn(watchGoToMain);

}

function *loggedInMainPageSaga() {
    console.log("Logged In Main Page Saga");
    yield spawn(watchLoginState);

    yield spawn(watchSignOut);
    yield spawn(watchGoToMain);

    yield spawn(watchToProfile);

}

function *profilePageSaga() {
    console.log("Profile Page Saga");
    yield spawn(watchLoginState);
    yield spawn(watchSignOut);
    yield spawn(watchGoToMain);
    yield spawn(watchPWChange);
    yield spawn(watchIntroChange);
    yield spawn(watchEscape);
}




///// Page별 saga함수에서 쓸 saga함수들 (watch 함수 편)
// watchLoginState: 브라우저에서의 로그인 여부 확인 및 state 업데이트
// <<주의>> 새로운 Page를 추가할 경우 PageSaga함수에 반드시 추가할 것
// <<주의>> 새로운 state를 추가할 경우 try-catch문을 이용해 정보를 받아온 후 스테이트에 업데이트 해야 함
function *watchLoginState() {
    console.log("pathname: ", window.location.pathname)

    /* 
     *   url 마지막에 '/'가 없는 경우
     */
    if(window.location.pathname[window.location.pathname.length-1] !== '/') {
        console.log("without /")
        yield put(actions.changeUrl(window.location.pathname+'/'));
        return;
    }

    if(window.location.pathname === '/' || window.location.pathname === '/sign_up/' || window.location.pathname === '/log_in/') {      
        /* 
         *   로그인 되어 있는 상태로 가입, 로그인, 초기 페이지에 접근하는 경우
         */
        if(localStorage.getItem("auth") !== null) {
            yield put(actions.changeUrl('/main/'));
        }
        
        /* 
         *   로그인 되어 있지 않은 상태로 가입, 로그인, 초기 페이지에 접근하는 경우
         */
        else {
  
        }
    }

    else {
        /* 
         *   로그인 되어 있지 않은 상태로 접근 불가 페이지에 접근하는 경우
         */
        if(localStorage.getItem("auth") === null) {
            yield put(actions.changeUrl('/'));
        }

        /* 
         *   로그인 되어 있는 상태
         */
        else {
            const path = window.location.pathname;
            let username = window.atob(localStorage.getItem("auth")).split(":")[0]
            console.log("username: ", username)
            console.log(yield select())
            let data, parent_data;

            /* =====================================================================================
                                                    메인 페이지                      
            =======================================================================================*/
            if(path === '/main/') { 
                let profile_user_data, my_groups_data, now_design_data;

                // 유저 정보
                try{
                    profile_user_data = yield call(xhr.get, fixed_url+'profile/', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic '+localStorage['auth'],
                            Accept: 'application/json'
                        },
                        responsetype: 'json',
                    });
                    console.log("GET profile_user data: ", profile_user_data.body)
                } catch(error) {
                    console.log("profile_user loading error")
                    console.log(error)
                    alert("데이터 로딩에 실패했습니다.")
                }

                

                

                yield put(actions.setState({
                    authorization: window.atob(localStorage['auth']),
                    profile_user: profile_user_data.body,
                    load: 0,
                    loading: true
                    //TODO 이후 state 추가 시 여기에 스테이트 업데이트 추가
                }));
            }


            /* =====================================================================================
                                                    그룹 페이지                      
            =======================================================================================*/
            
            /* 
             *   username 또는 id를 기준으로 backend에 겟을 날리는 경우 - 프로필, 그룹 디테일, 그룹 관리 페이지 
             */
            else {
                const username = path.split("/")[2];
                const id = path.split("/")[2];

                if (username === undefined || username === '') {
                    console.log("404 not found");
                    alert("없는 장소입니다.");
                    if(localStorage.getItem("auth") === null) {
                        // localStorage.removeItem('parent');
                        yield put(actions.changeUrl('/'));
                    } else {
                        // localStorage.removeItem('parent');
                        yield put(actions.changeUrl('/main/'));
                    }
                    return;
                }


            /* =====================================================================================
                                                    프로필 페이지                      
            =======================================================================================*/
                else if(path.split("/")[1] === 'profile'){
                    console.log("get profile id & pw details...");
                    let profile_id_pw_data, profile_user_data = null;

                    // 유저 아이디/비밀번호 정보
                    try{
                        profile_id_pw_data = yield call(xhr.get, fixed_url+'users/'+username+'/',{
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Basic '+localStorage['auth'],
                                Accept: 'application/json'
                            },
                            responseType: 'json'
                        });
                        console.log("GET profile_id_pw_data: ", profile_id_pw_data.body)
                    } catch(error){
                        console.log("profile data loading error")
                        console.log(error)
                        alert("데이터 로딩에 실패했습니다.");
                    }

                    // 유저 정보
                    try{
                        profile_user_data = yield call(xhr.get, fixed_url+'profile/', {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Basic '+localStorage['auth'],
                                Accept: 'application/json'
                            },
                            responsetype: 'json',
                        });
                        console.log("GET profile_user data: ", profile_user_data.body)
                    } catch(error) {
                        console.log("profile_user loading error")
                        console.log(error)
                        alert("데이터 로딩에 실패했습니다.")
                    }

                    yield put(actions.setState({
                        authorization: window.atob(localStorage['auth']),
                        profile_id_pw: profile_id_pw_data.body,
                        profile_user: profile_user_data.body,
                        load: 0,
                        loading: true
                    }));
                }

                else {
                    alert("없는 장소입니다.");
                    yield put(actions.changeUrl('/main/'))
                }
            }
        }
    }
    console.log("after watchLoginState : ", yield select());
}

// watchSignIn: 로그인 버튼 클릭 관찰
function *watchSignIn() {
    while(true) {
        const data = yield take(actions.SIGN_IN);
        yield call(signIn, data);
    }
}

// watchSignUp: 회원가입 버튼 클릭 관찰
function *watchSignUp() {
    while(true) {
        yield take('GOTO_SIGN_UP');
        yield put(actions.changeUrl('/sign_up/'));
    }
}

// watchSignOut: 로그아웃 버튼 클릭 관찰
function *watchSignOut() {
    while(true) {
        yield take('SIGN_OUT');
        localStorage.removeItem('auth');
        // localStorage.removeItem('parent');
        yield put(actions.changeUrl('/'));
    }
}

// watchPostSignUp: 회원가입 페이지에서 가입 버튼 클릭 관찰
function *watchPostSignUp() {
    while(true) {
      console.log("here");
        const data = yield take('POST_SIGN_UP');
        console.log(data);
        yield call(signUp, data);
    }
}



// watchGoToMain: 메인으로 돌아가기 버튼 클릭 관찰 및 리다이렉트
function *watchGoToMain() {
    while(true) {
        yield take('POST_BACK');
        yield put(actions.changeUrl('/main/'));
    }

}



function *watchToProfile() {
    while(true) {
        const data=yield take('TO_PROFILE');
        yield put(actions.changeUrl('/profile/' + data.profuser + '/'));
    }
}
function *watchIntroChange(){
    while(true){
        const data = yield take('TO_INTRO_CHANGE');
        console.log("##"+data.user);
        yield call(updateIntro, data.user, data.myname, data.mybelong, data.myintro, data.removeImg, data.changeImg, data.img);
    }
}
function *watchPWChange(){
    while(true){
        const data = yield take('TO_PW_CHANGE');
        console.log("**get PW change action");
        yield call(updatePW, data.profuser, data.newpw);
    }
}
function *watchEscape(){
    while(true){
        const data = yield take('TO_ESCAPE');
        console.log("**get excape action");
        yield call(escapeBook, data.profuser);
    }
}



///// Page별 saga함수에서 쓸 saga함수 (그 외)
// signIn: 백엔드에 get을 날리는 함수
function *signIn(data) {
    const encodedData = window.btoa(data.username + ":" + data.password);
    try {
        yield call(xhr.get, auth_check_url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic '+ encodedData,
                Accept: 'application/json'
            },
            responseType: 'json'
        })
        console.log("Login Success without exception");
        localStorage.setItem("auth", encodedData);
        yield put(actions.changeUrl('/main/'));
    }
    catch(error) {
        alert("아이디 또는 비밀번호를 다시 확인해주세요.");
        console.log(error)
    }
}

// signUp: 백엔드 users POST를 날리는 함수
function *signUp(data) {
    try {
        yield call(xhr.post, fixed_url + 'users/', {
            headers: {
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            contentType:'json',
            body: JSON.stringify({"username": data.username, "password": data.password})
        });
        console.log("post article succeed 1");
        localStorage.setItem("auth", window.btoa(data.username + ":" + data.password));
        yield put(actions.changeUrl('/main/'));
    }
    catch(error) {
        if(error.statusCode === 405) {
            console.log("already existing name");
            alert("이미 있는 username입니다")
        }
        else if(error.statusCode === 405) {
            console.log("too short or long user name");
            alert("username은 4글자 이상, 20글자 이하여야 합니다.")
        }
        else {
            console.log(error)
            alert("회원가입에 실패했습니다.");
        } 
    }
}



// 비밀번호 바꾼 걸 put 요청 보내는 함수
function *updatePW(profuser, newpw){
    const backPath = 'users/'+profuser+'/';
    try{
        yield call(xhr.send, fixed_url+backPath, {
            method: 'PUT',
            headers: {
                "Authorization": "Basic "+localStorage['auth'],
                "Content-Type": 'application/json',
                Accept: 'application/json',
            },
            responseType:'json',
            body: JSON.stringify({"username": profuser, "password": newpw})
        });
        console.log("put password succeed ");
        localStorage.setItem("auth", window.btoa(profuser + ":" + newpw));
        //auto sign out
        yield put(actions.changeUrl('/main/'));
    }catch(error){
        alert("비밀번호를 변경할 수 없습니다.");
        return;
    }
}
// profile을 수정한걸 post요청보내는 함수
function *updateIntro(profuser, myname, mybelong, myintro, removeImg, changeImg, img){
    const backPath = 'users/'+profuser+'/profile/';
    try {
        let form = new FormData();
        form.append('user', profuser);
        form.append('myname', myname);
        form.append('mybelong', mybelong);
        form.append('myintro', myintro);
        if(removeImg === true && changeImg === true && img !== null)
            form.append('myimage', img);
        else if(removeImg === true)
            form.append('myimage', null);
        yield call(xhr.send, fixed_url + backPath, {
            method: 'PUT',
            headers: {
                "Authorization": "Basic " + localStorage['auth'],
            },
            async: true,
            crossDomain: true,
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            body: form
        });
        console.log("put profile succeed");

        yield put(actions.changeUrl('/profile/'+profuser+'/'))
    } catch(error){

            console.log("프로필을 변경할 수 없습니다.");
            return ;

    }
}
function *escapeBook(profuser){
    const backPath = 'users/'+profuser+'/';
    try{
        yield call(xhr.send, fixed_url+backPath,{
            method : 'DELETE',
            headers:{
                'Authorization': 'Basic '+localStorage['auth'],
                Accept: 'application/json'
            },
            responseType: 'json',
        });
        console.log("delete account succeed!");
        localStorage.removeItem('auth');
        yield put(actions.changeUrl('/'));
    }catch(error){
        alert("탈퇴에 실패했습니다.");
        return ;

    }
}

