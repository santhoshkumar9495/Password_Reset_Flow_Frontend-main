import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/EmptyAvatar.jpg';
import toast, { Toaster } from 'react-hot-toast';
import TextField from "@mui/material/TextField";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { useFormik } from 'formik';
import convertToBase64 from '../helper/convert';
import { registerValidation } from '../helper/Validate'
import {registerUser} from '../api/user.api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState()
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const formik = useFormik({
    initialValues : {
      email: '',
      username: '',
      password : ''
    },

    validate : registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
      values = await Object.assign(values, { profile : file || ''});
      try{
        let registerPromise = registerUser(values);
        registerPromise.then(function(){toast.success('Registeration Successfull');
        setTimeout(()=>{
          navigate('/');
        },3000);
        }).catch((res)=>toast.error(res.response.data.msg))
      }catch(error){
        console.log(error);
        return Promise.reject({ error })
      }
    }
  })

  /** formik doensn't support file upload so we need to create this handler */
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  return (
    <div className="loginscreen">
    <Toaster position='top-center' reverseOrder={false}></Toaster>
    
        <div
          data-aos="zoom-in-up"
          data-aos-duration="1000"
          class="jumbotron1 p-3"
        >
          <h6 class="display-6 text-start">Register</h6>
          <div className='py-1 text-sm text-center text-gray-500'>
                  Connect with us for a better world
                </div>
          <div className="textfields">
          <form className='py-1' onSubmit={formik.handleSubmit}>
                  <div className='profile py-1 profilepicturediv'>
                  <div class="image-cropper" style={{display:"flex",justifyContent:"center"}}>
  <img src={file || avatar}  class="profile-pic" alt="avatar"/>
</div>   
              </div>
              <div className='profilepicturediv' style={{marginBottom:"5%"}}>     
                  <input onChange={onUpload} type="file" id='profile' name='profile' /> </div> 
                  <div style={{margin:"2%",marginTop:"7%"}}>
                    <div style={{margin:"2%",marginBottom:"2%"}}><label>Email</label></div>
                      <div> <TextField
                      id="email"
                      label="Email id"
                      variant="outlined"
                      sx={{ width: "100%", display: "flex", color: "black"}}
                      {...formik.getFieldProps('email')} 
                    />
                    </div>
                    <div style={{margin:"2%",marginBottom:"2%"}}><label>Username</label></div>
                      <div> <TextField
                      id="username"
                      label="Username"
                      variant="outlined"
                      sx={{ width: "100%", display: "flex", color: "black"}}
                      {...formik.getFieldProps('username')} 
                    />
                    </div>
                    <div style={{margin:"2%",marginBottom:"2%"}}><label>Password</label></div>
                    <FormControl sx={{ width: "100%", display: "flex", color: "white"}} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                  <OutlinedInput
                    {...formik.getFieldProps('password')}
                    id="password"
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
                      <div style={{display:"flex",justifyContent:"center"}}><button  style={{border:"none",color:"white",backgroundColor:"blueviolet",padding:"5px",margin:"10px",borderRadius:"5px",fontSize:"22px",fontWeight:"500"}} type='submit'><span>Register</span></button></div>
                  </div>
        <p className="text-center">Already have account?
          <Link className="anchorlink" to="/">
            <span className="anchorlinkname">Login</span>
          </Link>
        </p>


              </form>
              </div>
        </div>
      </div>
  );
}
