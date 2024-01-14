import React from "react";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Toaster } from 'react-hot-toast';
import './Pages.css';
import avatar from '../assets/Avatar.png';
import {usernameValidate} from '../helper/Validate';
import {useAuthStore} from '../store/store';

export default function UsernamePage() {
  const navigate = useNavigate();
  const setUsername = useAuthStore(state => state.setUsername);

  const formik = useFormik({
    initialValues : {
      username : ''
    },
    validate : usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
    setUsername(values.username);
      navigate('/password');
    }
  })

  return (
    <div className="loginscreen">
<Toaster position='top-center' reverseOrder={false}></Toaster>

    <div
      data-aos="zoom-in-up"
      data-aos-duration="1000"
      class="jumbotron1 p-3"
    >
      <h6 class="display-6 text-center">Hello User</h6>
      <div class="text-center">Welcome to our World, Log in to visit our latest features...</div>
      <hr></hr>
      <div className="textfields">
      <form className='py-1' onSubmit={formik.handleSubmit}>
              <div className='profile d-flex justify-content-center py-2'>
                  <img src={avatar} style={{width:"50%",height:"50%"}} className="" alt="avatar" />
              </div>

              <div style={{margin:"1%"}}>
                <div style={{margin:"1%",marginBottom:"2%"}}><label>Username</label></div>
                  <div> <TextField
                  id="username"
                  label="Username"
                  variant="outlined"
                  sx={{ width: "100%", display: "flex", color: "black"}}
                  {...formik.getFieldProps('username')} 
                />
                </div>
                  <div style={{display:"flex",justifyContent:"center"}}><button className="createproductbutton" style={{border:"none",color:"white",backgroundColor:"blueviolet",padding:"5px",margin:"10px",borderRadius:"5px",fontSize:"22px",fontWeight:"500"}} type='submit'><span>Explore</span></button></div>
              </div>

              <div className="text-center py-4">
                <span className='text-gray-500'>New User<Link className='text-red-500' to="/register">Register Now</Link></span>
              </div>
          </form>
      </div>
    </div>
  </div>
  )
}