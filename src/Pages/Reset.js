import React, { useState} from "react";
import TextField from "@mui/material/TextField";
import { useNavigate, Navigate} from 'react-router-dom';
import {RxCross2} from 'react-icons/rx';
import {TiTick} from 'react-icons/ti';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import './Pages.css';
import { resetPasswordValidation } from '../helper/Validate';
import useFetch from '../hooks/fetchhooks';
import {useAuthStore} from '../store/store';
import {resetPassword} from '../api/user.api';

export default function ResetPage() {
  const { username } = useAuthStore(state => state.auth);
  const navigate = useNavigate();
  const [{ isLoading, apiData, status, serverError }] = useFetch(`otp/createResetSession?username=${username}`);
  // /otp/createResetSession?username=admin
  const passVerificationError = {
    isLenthy: false,
    hasLower: false,
    hasNumber: false,
    hasSpclChr: false,
    confirmPass: false,
  };
  const [form, setForm] = useState({});
  const [testing, settesting] = useState("");
  const [testingcp, settestingcp] = useState("");
  const [passwordError, setPasswordError] = useState(passVerificationError);

  function handleInput(e) {
    const {id,value}=e.target;
      const formCopy = {
        ...form,
        [id]: value,
      };
      setForm(formCopy);

      if (id === "password") {
        const isLenthy = value.length > 6;
        const hasLower = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpclChr = /[@,#,$,%,&]/.test(value);
  
        setPasswordError({
          ...passwordError,
          isLenthy,
          hasLower,
          hasNumber,
          hasSpclChr,
        });
      }

      if (id === "confirmpassword") {
        setPasswordError({
          ...passwordError,
          confirmpassword: form.password === value,
        });
      }
      settesting(document.getElementById("password").value);
      settestingcp(document.getElementById("confirmpassword").value);
  }
  // function validatetextboxes() {
  //   console.log(form);
  // }
  const formik = useFormik({
    initialValues: {
      password : '',
      confirm_pwd: ''
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      
      let resetPromise = resetPassword({ username, password: values.password })
      toast.promise(resetPromise, {
        loading: 'Updating Password...',
        success: <b>Password Changed Successfully...!</b>,
        error : <b>Could not Reset!</b>
      });
      resetPromise.then(function(){ navigate('/password') });
    }
  })


  if(isLoading) return <h1 className='text-2xl font-bold' style={{display:"flex",justifyContent:"center",alignItems:"center"}}><div class="spinner-border text-primary" role="status">
  <span class="sr-only"></span>
</div>Loading...</h1>;
  if(serverError) return <h1 className='text-xl text-red-500' style={{display:"flex",justifyContent:"center",alignItems:"center"}} ><div class="alert alert-danger" role="alert">{serverError.message}
</div></h1>
  if(status && status !== 201) return <Navigate to={'/password'} replace={true}></Navigate>
  return (
    <div className="loginscreen">
      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div
        data-aos="zoom-in-up"
        data-aos-duration="1000"
        class="jumbotron1 p-3"
      >
        <div className="input text-center">
        <h6 class="display-6 text-center">Account Recovery</h6>
                <span className='py-4 text-sm text-left text-gray-500'>
                  Enter new Password to Recover your Account
                </span>
              </div>
        <div className="textfields">
        <form className='py-20' onSubmit={formik.handleSubmit}>

        <TextField
                  required
                  id="password"
                  label="Password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  sx={{
                    display: "flex",
                    width: "100%",
                    my:3,
                  }}
                  value={form && form["confirmpassword"]}
                  onChange={handleInput}
                  {...formik.getFieldProps('password')}
                />
                <TextField
                  required
                  id="confirmpassword"
                  label="Confirm Password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  sx={{
                    display: "flex",
                    width: "100%",
                    my:3,
                  }}
                  value={form && form["confirmpassword"]}
                  onChange={handleInput}
                  {...formik.getFieldProps('confirm_pwd')}
                />
 {testingcp.length>0 ? (!passwordError.confirmpassword ? (
                <div className="text-danger">Password doesn't matching!</div>
              ):(
                <div className="text-success">Password matching</div>
              )):""}

 {testing.length>0 && 
   <div style={{textAlign:"start"}}>
<div style={{color:"blue"}}>Requirements</div>
 <ul className="mb-4" style={{listStyle:"none"}}>
              <li
                className={
                  passwordError.isLenthy ? "text-success" : "text-danger"
                }
              >
              <span>{passwordError.isLenthy?<span style={{color:"green"}}><TiTick/></span>:<span style={{color:"red"}}><RxCross2/></span>}</span>  Min 8 characters
              </li>
              <li
                className={
                  passwordError.hasLower ? "text-success" : "text-danger"
                }
              >
               <span>{passwordError.hasLower?<span style={{color:"green"}}><TiTick/></span>:<span style={{color:"red"}}><RxCross2/></span>}</span> At least one lower case
              </li>
              <li
                className={
                  passwordError.hasNumber ? "text-success" : "text-danger"
                }
              >
               <span>{passwordError.hasNumber?<span style={{color:"green"}}><TiTick/></span>:<span style={{color:"red"}}><RxCross2/></span>}</span> At least one number
              </li>
              <li
                className={
                  passwordError.hasSpclChr ? "text-success" : "text-danger"
                }
              >
               <span>{passwordError.hasSpclChr?<span style={{color:"green"}}><TiTick/></span>:<span style={{color:"red"}}><RxCross2/></span>}</span> At least one of the special characters i.e @ # $ % &
              </li>
            </ul></div>} 
            <div style={{display:"flex",justifyContent:"center"}}> 
      <button style={{border:"none",color:"white",backgroundColor:"blueviolet",padding:"5px",margin:"10px",borderRadius:"5px",fontSize:"22px",fontWeight:"500"}} type='submit'>Reset Password</button></div>
      <form/></form>
        </div>
      </div>
    </div>
  )
}