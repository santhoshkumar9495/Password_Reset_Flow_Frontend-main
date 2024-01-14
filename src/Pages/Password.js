import React, { useState, useEffect } from "react";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import './Pages.css';
import avatar from '../assets/Avatar.png';
import { passwordValidate } from '../helper/Validate';
import useFetch from '../hooks/fetchhooks';
import {useAuthStore} from '../store/store';
import {verifyPassword} from '../api/user.api';

export default function PasswordPage() {

  const navigate = useNavigate();
  const { username } = useAuthStore(state => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);


  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      try{
        let loginPromise = verifyPassword({ username, password : values.password })
      toast.promise(loginPromise, {
        loading: 'Checking...',
        success : <b>Login Successfull..!</b>,
        error : <b>Password not Matching!</b>
      });
      loginPromise.then(res => {
        let { token } = res.data;
        localStorage.setItem('token', token);
        navigate('/profile')
      });
      }catch(error){
        return toast.error('Password not matching!!!');
      }
    }
  })

  if(isLoading) return <h1 className='text-2xl font-bold' style={{display:"flex",justifyContent:"center",alignItems:"center"}}><div class="spinner-border text-primary" role="status">
  <span class="sr-only"></span>
</div>Loading...</h1>;
  if(serverError) return <h1 className='text-xl text-red-500' style={{display:"flex",justifyContent:"center",alignItems:"center"}} ><div class="alert alert-danger" role="alert">{serverError.message}
</div></h1>

  return (
    <div className="loginscreen">
      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div
        data-aos="zoom-in-up"
        data-aos-duration="1000"
        class="jumbotron1 p-3"
      >
        <h6 class="display-6 text-center">Hello <span style={{color:"blue"}}>{apiData?.firstName || apiData?.username}</span></h6>
        <div class="text-center">Connect with us to explore more...</div>
        <div className="textfields">
          <form className='py-1' onSubmit={formik.handleSubmit}>
          <div className='profile profilepicturediv'>
            <div className='profile d-flex justify-content-center image-cropper'>
              <img src={apiData?.profile || avatar} className="profile-pic" alt="avatar" />
            </div></div>

            <div style={{ margin: "2%" }}>
              <div style={{ margin: "1%" }}><label>Password</label></div>
              <div>
                <FormControl sx={{ width: "100%", display: "flex", color: "white",m: 1}} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                  <OutlinedInput
                    {...formik.getFieldProps('password')}
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                    
                  />
                </FormControl>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}><button className="createproductbutton" style={{ border: "none", color: "white", backgroundColor: "blueviolet", padding: "5px", margin: "10px", borderRadius: "5px", fontSize: "22px", fontWeight: "500" }} type='submit'><span>Log in</span></button></div>
            </div>

            <div className="text-center py-4">Forget Password ?
            <Link className="anchorlink" to="/recovery">
            <span className="anchorlinkname">Change Password</span>
          </Link>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}