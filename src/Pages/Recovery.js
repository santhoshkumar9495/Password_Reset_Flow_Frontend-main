import React, { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import './Pages.css';
import { MuiOtpInput } from 'mui-one-time-password-input'
import {useAuthStore} from '../store/store';
import {generateOTP,verifyOTP} from '../api/user.api';


export default function RecoveryPage() {
  const navigate=useNavigate();
  const { username } = useAuthStore(state => state.auth);
  const [OTP, setOTP] = useState();

  const handleChange = (newValue) => {
    setOTP(newValue);
  }

  useEffect(() => {
    generateOTP(username).then((sendotp) => {
      console.log(sendotp);
      if(sendotp) return toast.success('OTP has been send to your email!');
      return toast.error('Problem while generating OTP!')
    })
  }, [username]);

  async function onSubmit(e){
    e.preventDefault();
    try {
      let { status } = await verifyOTP({ username, code : OTP })
      if(status === 201){
        toast.success('OTP Verified, you can recover your account now');
        setTimeout(()=>{
          navigate('/reset');
        },3000);
        // toast.success('Verified Successfully!');
        // return navigate('/reset');
      }else{
        return toast.error('OTP is invalid Check Email again! Check email again!');
      }  
    } catch (error) {
      return toast.error('OTP is invalid!');
    }
  }

 // handler of resend OTP
 function resendOTP(){
  let sentPromise = generateOTP(username);
  toast.promise(sentPromise ,
    {
      loading: 'Sending...',
      success: <b>we have resend OTP to your Email !</b>,
      error: <b>Could not Send it!</b>,
    }
  );
  sentPromise.then((sendOTP) => {
    console.log(sendOTP)
  });
  
}

  return (
    <div className="loginscreen">
      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div
        data-aos="zoom-in-up"
        data-aos-duration="1000"
        class="jumbotron1 p-3"
      >
        <h6 class="display-6 text-center">Account Recovery !</h6>
        <div class="text-center">Enter OTP to Change your Password</div>
        <div className="textfields">
          <form className='pt-10' onSubmit={onSubmit}>
            <div style={{ margin: "2%" }}>
              <div className="input text-center">
                <span className='py-4 text-sm text-left text-gray-500'>
                  Enter 6 digit OTP sent to your email address.
                </span>
              </div>
              <div> <MuiOtpInput value={OTP} onChange={handleChange} color={"black"} length={6} /></div>
              <div>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}><button className="createproductbutton" style={{ border: "none", color: "white", backgroundColor: "blueviolet", padding: "5px", margin: "10px", borderRadius: "5px", fontSize: "22px", fontWeight: "500" }} type='submit'><span>Recover</span></button></div>
            </div>
            </form>
            <div className="text-center py-4">Didn't get OTP?

              <span className="anchorlinkname"><button style={{ border: "none" }} onClick={resendOTP}>Resend</button></span>

            </div>

          

        </div>
      </div>
    </div>
  )
}