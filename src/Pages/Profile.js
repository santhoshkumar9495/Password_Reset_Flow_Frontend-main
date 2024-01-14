import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import avatar from '../assets/EmptyAvatar.jpg';
import toast, { Toaster } from 'react-hot-toast';
import TextField from "@mui/material/TextField";
import { useFormik } from 'formik';
import { Grid } from "@mui/material";
import { profileValidation } from '../helper/Validate'
import useFetch from '../hooks/fetchhooks';
import convertToBase64 from '../helper/convert';
import {updateUser} from '../api/user.api';


export default function ProfilePage() {
  const [{ isLoading, apiData, serverError }] = useFetch();
  const navigate = useNavigate()
  const [file, setFile] = useState();
  const formik = useFormik({
    initialValues : {
      firstName : apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address : apiData?.address || ''
    },
    enableReinitialize: true,
    validate : profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
     values = await Object.assign(values, { profile : file || apiData?.profile || ''});
      let updatePromise = updateUser(values);

      toast.promise(updatePromise, {
        loading: 'User Details Updating...',
        success : <b>Update Successfull...!</b>,
        error: <b>Could not Update!</b>
      });
    }
  })

  /** formik doensn't support file upload so we need to create this handler */
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }


  // logout handler function
  function userLogout(){
    localStorage.removeItem('token');
    navigate('/')
  }

  if(isLoading) return <h1 className='text-2xl font-bold' style={{display:"flex",justifyContent:"center",alignItems:"center"}}><div class="spinner-border text-primary" role="status">
  <span class="sr-only"></span>
</div>Loading...</h1>;
  if(serverError) return <h1 className='text-xl text-red-500' style={{display:"flex",justifyContent:"center",alignItems:"center"}} ><div class="alert alert-danger" role="alert">{serverError.message}
</div></h1>

  return (
    <div className="loginscreen2">
    <Toaster position='top-center' reverseOrder={false}></Toaster>
    
        <div
          data-aos="zoom-in-up"
          data-aos-duration="1000"
          class="jumbotron2 p-2"
        >
          <h6 class="display-6 text-start">Profile</h6>
          <div className='py-1 text-sm text-center text-gray-500'>
                  Add your Personal details
                </div>
          <div className="textfields">
          <form className='py-1' onSubmit={formik.handleSubmit}>
                  <div className='profile py-1 profilepicturediv'>
                  <div class="image-cropper" style={{display:"flex",justifyContent:"center"}}>
  <img src={apiData?.profile || file || avatar}  class="profile-pic" alt="avatar"/>
</div>                 </div>
<div className='profilepicturediv' style={{marginBottom:"5%"}}>     
                  <input onChange={onUpload} type="file" id='profile' name='profile' /> </div> 
                  <div style={{margin:"1%"}}>
                  <Grid container spacing={1} item={true} sx={{justify: "Center" }}>
          <Grid
            className="Cardslist"
            xs={12}
            sm={12}
            md={6}
            lg={6}
          ><div style={{margin:"2%"}}>
           <div style={{marginBottom:"2%"}}><label>First Name</label></div>
                      <div> <TextField
                      id="firstName"
                      label="First Name"
                      variant="outlined"
                      sx={{ width: "100%", display: "flex", color: "black"}}
                      {...formik.getFieldProps('firstName')} 
                    />
                    </div>
                    </div></Grid>
          <Grid
            className="Cardslist"
            xs={12}
            sm={12}
            md={6}
            lg={6}
          ><div style={{margin:"2%"}}>
           <div style={{marginBottom:"2%"}}><label>Last Name</label></div>
                      <div> <TextField
                      id="lastName"
                      label="Last Name"
                      variant="outlined"
                      sx={{ width: "100%", display: "flex", color: "black"}}
                      {...formik.getFieldProps('lastName')} 
                    />
                    </div>
                    </div></Grid>
          </Grid>
         <Grid container spacing={1} item={true} sx={{justify: "Center" }}>
          <Grid
            className="Cardslist"
            xs={12}
            sm={12}
            md={6}
            lg={6}
          ><div style={{margin:"2%"}}>
          <div style={{margin:"2%",marginBottom:"2%"}}><label>Email</label></div>
                      <div> <TextField
                      id="email"
                      label="Email id"
                      variant="outlined"
                      sx={{ width: "100%", display: "flex", color: "black"}}
                      {...formik.getFieldProps('email')} 
                    />
                    </div>
                    </div></Grid>
          <Grid
            className="Cardslist"
            xs={12}
            sm={12}
            md={6}
            lg={6}
          ><div style={{margin:"2%"}}>
           <div style={{marginBottom:"2%"}}><label>Mobile</label></div>
                      <div> <TextField
                      id="mobile"
                      label="Mobile"
                      variant="outlined"
                      sx={{ width: "100%", display: "flex", color: "black"}}
                      {...formik.getFieldProps('mobile')} 
                    />
                    </div>
                    </div></Grid>
          </Grid> 
          <div style={{display:"flex",justifyContent:"center"}}>
          <Grid container spacing={1} item={true} sx={{justify: "Center",width: '75%' }}>
          <Grid
            className="Cardslist"
            xs={12}
            sm={12}
            md={12}
            lg={12}
          ><div style={{margin:"2%"}}>
          <div style={{marginBottom:"1%"}}><label>Address</label></div>
                      <div> <TextField
                      id="address"
                      label="Address"
                      variant="outlined"
                      sx={{ width: "100%", display: "flex", color: "black"}}
                      {...formik.getFieldProps('address')} 
                    />
                    </div>
                    </div></Grid>
          </Grid> </div>
                      <div style={{display:"flex",justifyContent:"center"}}><button  style={{border:"none",color:"white",backgroundColor:"blue",padding:"5px",margin:"10px",borderRadius:"5px",fontSize:"22px",fontWeight:"500"}} type='submit'><span>Update</span></button></div>
                  </div>
        <p className="text-center">Fill this later? 
        <button onClick={userLogout} style={{border:"none",backgroundColor:"white"}} className='text-red-500' to="/">Logout</button>
        </p>
              </form>
              </div>
        </div>
      </div>
  );
}
