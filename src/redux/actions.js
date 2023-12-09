

import * as types from "./actionTypes";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const loginRequest = () => {
    return {
        type: types.LOGIN_REQUEST,
    }
}

const loginSuccess = (payload) => {
    return {
        type: types.LOGIN_SUCCESS,
        payload
    }
}

const loginFailure = () => {
    return {
        type: types.LOGIN_FAILURE,
    }
}
const logoutRequest = () => {
    return {
        type: types.LOGOUT_REQUEST,
    }
}

const logoutSuccess = () => {
    return {
        type: types.LOGOUT_SUCCESS,
    }
}

const logoutFailure = () => {
    return {
        type: types.LOGOUT_FAILURE,
    }
}

const userRegister = (payload) => (dispatch) => {
    const { email, password } = payload;
    try {

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                console.log('user: ', user);

                // ...
            })
            .catch((error) => {
                console.log('error: ', error);
                // const errorCode = error.code;
                // const errorMessage = error.message;
                // ..
            });
    } catch (error) {
        console.log('error: ', error);
    }
}

const userLogin = (payload) => (dispatch) => {
    const { email, password } = payload;
    try {
        dispatch(loginRequest())
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                dispatch(loginSuccess(user.accessToken))
                console.log('user: ', user);
                // ...
            })
            .catch((error) => {
                console.log('error: ', error);
                dispatch(loginFailure())
                // const errorCode = error.code;
                // const errorMessage = error.message;
            });
    } catch (error) {
        console.log('error: ', error);
        dispatch(loginFailure())

    }
}
export {
    loginRequest, loginSuccess, loginFailure, userLogin, userRegister,
    logoutRequest, logoutSuccess, logoutFailure
}