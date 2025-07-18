import React, { useState, useContext } from 'react'
import AuthLayout from "../../components/layout/AuthLayout"
import { useNavigate, Link } from 'react-router-dom';
import ProfilePhotoSelector from '../../components/input/ProfilePhotoSelector';
import AuthInput from "../../components/input/AuthInput"
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS, BASE_URL } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadImage.js';
import { UserContext } from '../../context/UserContext';

const SignUpForm = () => {

  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { updateUser } = useContext(UserContext);

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  //handle Sign Up form submit
  const handleSignUp = async(e)=>{
    // Handle SignUp form submit
        e.preventDefault();
        let profileImageUrl = "";
        //defining validateEmail(email) function in other file utils

        if(!fullName){
          setError("Please enter the full name");
          return;
        }
       
        if(!validateEmail(email)){
          setError("Please enter a valid email address.");
          return;
        }
         if(!username){
          setError("Please enter the username");
          return;
        }

        if(!password){
          setError("Please enter the password");
          return;
        }
        setError("");
    
    //Login API
    try {
      
      if(profilePic){
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        username,
        email,
        password,
        profileImageUrl,
      });
      const { token, user } = response.data;
      if (token) {
        // console.log({token, user});
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
      
    } catch (error) {

      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong, try after sometime.");
      }

    }

  }
  
  return (
    <div>
      <AuthLayout>
          <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
            <h3 className='text-xl font-semibold text-black' >Create an Account</h3>
            <p className='text-xs text-slate-700 mt-[5px] mb-6'>
              Join us today by entering your details below.
            </p>

          <form onSubmit={handleSignUp} >
              <ProfilePhotoSelector image={profilePic} setImage={setProfilePic}/>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <AuthInput
                    value={fullName}
                    onChange={({target}) => setFullName(target.value)}
                    label = "Full Name"
                    placeholder="Abc Xyz"
                    type= "text"
                  />
                  <AuthInput
                    value = {email}
                    onChange = {({target}) => setEmail(target.value)}
                    label = "email address"
                    placeholder = "example@gmail.com"
                    type = 'text'
                  />
                  <AuthInput
                    value = {username}
                    onChange = {({target}) => setUsername(target.value)}
                    label = "username"
                    placeholder = "@"
                    type = 'text'
                  />
                  <AuthInput
                    value = {password}
                    onChange = {({target}) => setPassword(target.value)}
                    label = "password"
                    placeholder = "Min 8 characters"
                    type = 'password'
                  />
              </div>

              {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
                      <button type="submit" className='btn-primary'>
                        CREATE ACCOUNT
                      </button>

                      <button
                        type="button"
                        onClick={() => window.location.href = `${BASE_URL}${API_PATHS.AUTH.GOOGLE_LOGIN}`}
                        className="btn-google mt-3"
                      >
                        <img 
                          src="https://developers.google.com/identity/images/g-logo.png" 
                          alt="Google logo" 
                          className="inline w-5 h-5 mr-2"
                        />
                        Sign up with Google
                      </button>




                      <p className='text-[13px] text-slate-800 mt-3'>
                        Already have an account?{""}
                        <Link className="font-medium text-primary underline" to="/login">Login</Link>
                      </p>  



          </form>


          </div>
      </AuthLayout>
    </div>
  )
}

export default SignUpForm
