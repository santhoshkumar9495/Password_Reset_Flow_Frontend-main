import axios from 'axios';
import jwt_decode from 'jwt-decode';
import {API} from '../global';

const authenticateapi=API+'/api/authenticate';
const getuserapi=API+'/api/user/';
const registeruserapi=API+'/api/register';
const eamilapi=API+'/api/registerMail';
const userloginapi=API+'/api/login';
const updateuserapi=API+'/api/edituser';
const generateotpapi=API+'/api/otp/generateOTP';
const verifyotpapi=API+'/api/otp/verifyOTP';
const passwordresetapi=API+'/api/otp/reset-password';
const createsessionotpapi=API+'/api/otp/createResetSession';


/** To get username from Token */
export async function getUsername(){
    const token = localStorage.getItem('token')
    if(!token) return Promise.reject("Cannot find Token");
    let decode = jwt_decode(token);
    return decode;
}

/** authenticate function */
export async function authenticate(username){
    try {
        return await axios.post(authenticateapi, { username })
    } catch (error) {
        return { error : "Username doesn't exist...!"}
    }
}

/** get User details */
export async function getUser({ username }){
    try {
        const { data } = await axios.get(getuserapi+username);
        return { data };
    } catch (error) {
        return { error : "Password doesn't Match...!"}
    }
}




export const registerUser = (credentials) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(registeruserapi, credentials);
        resolve(res.data);
    let { username, email } = credentials;
               /** send email */
        if(res.status === 201){
            await axios.post(eamilapi, { username, userEmail : email, text : res.data.msg});
           resolve(res.data);
        }
      } catch (error) {
        reject(error);
      }
    });
  };


/** login function */
export async function verifyPassword({ username, password }){
    try {
        if(username){
            const { data } = await axios.post(userloginapi, { username, password })
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error : "Password doesn't Match...!"})
    }
}

/** update user profile function */
export async function updateUser(response){
    try {
        
        const token = await localStorage.getItem('token');
        const data = await axios.put(updateuserapi, response, { headers : { "Authorization" : token}});

        return Promise.resolve({ data })
    } catch (error) {
        return Promise.reject({ error : "Couldn't Update Profile...!"})
    }
}

/** generate OTP */
export async function generateOTP(username){
    try {
        const {data : { code }, status } = await axios.get(generateotpapi, { params : { username }});

        // send mail with the OTP
        if(status === 201){
            let { data : { email }} = await getUser({ username });
            let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
            await axios.post(eamilapi, { username, userEmail: email, text, subject : "Password Recovery OTP"})
        }
        return Promise.resolve(code);
    } catch (error) {
        return Promise.reject({ error });
    }
}

/** verify OTP */
export async function verifyOTP({ username, code }){
    try {
       const { data, status } = await axios.get(verifyotpapi, { params : { username, code }})
       return { data, status }
    } catch (error) {
        return Promise.reject(error);
    }
}

/** Create Session for OTP */
export async function CreateSessionOTP(username){
    try {
       const { data, status } = await axios.get(createsessionotpapi,{ params : { username }})
       return { data, status }
    } catch (error) {
        return Promise.reject(error);
    }
}



/** reset password */
export async function resetPassword({ username, password }){
    try {
        const { data, status } = await axios.put(passwordresetapi, { username, password });
        return Promise.resolve({ data, status})
    } catch (error) {
        return Promise.reject({ error })
    }
}