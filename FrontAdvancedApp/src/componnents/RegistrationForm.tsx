import { FC, useEffect, useState } from 'react'
import avatar from '../assets/avatar.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import userService, { User } from '../services/user_service'
import { useNavigate } from "react-router-dom"
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { zodResolver } from "@hookform/resolvers/zod"; 
import {userValidSchema, profileSchema} from "../services/validationSchema_service"
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.webp";
import image5 from "../assets/image5.webp";
import "./loginRegister.css";

const images = [image1, image2, image3, image4, image5];

const RegistrationForm: FC = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const navigate = useNavigate()
    const [currentImage, setCurrentImage] = useState(0);
    const [fade, setFade] = useState(true);
    useEffect(() => {
      const interval = setInterval(() => {
          setFade(false); // Start fade-out

          setTimeout(() => {
              setCurrentImage((prevImage) => (prevImage + 1) % images.length);
              setFade(true); // Fade in new image
          }, 400); // Wait for fade-out before changing image
      }, 5000); // Change every 5 seconds

      return () => clearInterval(interval); // Cleanup interval
  }, []);



    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm<userValidSchema>({
        resolver: zodResolver(profileSchema),
      });
    const [img] = watch(["img"])
    const inputFileRef: { current: HTMLInputElement | null } = { current: null }
    



    const onSubmit = async (data: userValidSchema) => {
        try {
          setErrorMessage(null);
      
          let imgUrl = "";
          if (data.img && data.img.length > 0) {
            const { request } = userService.uploadImage(data.img[0]);
            const response = await request;
            imgUrl = response.data.url;
          }
      
          const user: User = {
            username: data.username,
            email: data.email,
            password: data.password,
            imgUrl: imgUrl || undefined,
          };
      
          await userService.register(user); // simplified
      
          navigate("/login"); // success
        } catch (error: any) {
          console.error("Registration error:", error);
      
          if (error.message) {
            setErrorMessage(error.message);
          } else if (error instanceof Object && error.message) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage("Registration failed. Please try again.");
          }
        }
      };
      


    useEffect(() => {
        if (img != null && img[0]) {
            setSelectedImage(img[0])
        }
    }, [img]);
    const { ref, ...restRegisterParams } = register("img")



    const onGoogleRegisterSuccess = async (credentialResponse: CredentialResponse)=>{
        try{
            const data = await userService.registerWithGoogle(credentialResponse)
            console.log("Google register response:", data);
            if (!data.username) {
                // Means the server returned empty fields => user is already registered
                alert("You are already registered. Please log in using your credentials.");
                navigate("/login");

            }else{
                localStorage.setItem("token",data.accessToken)
                localStorage.setItem("refreshToken",data.refreshToken)
                navigate('/home')
            }   
        }
        catch(err){
            console.log('login error',err);
        }
    }

    const onGoogleFailure = ()=>{
        console.log("Google login failure")
    }

  return (
    <div
      className={`registration-container ${fade ? "fade-in" : "fade-out"}`}
      style={{ backgroundImage: `url(${images[currentImage]})` }}
    >
      <div className="registration-overlay"></div>
  
      <div className="registration-form-container">
        <h2>Registration Form</h2>
  
        {errorMessage && <p className="error-text">{errorMessage}</p>}
  
        {/* ✅ FORM starts here */}
        <form onSubmit={handleSubmit(onSubmit)}>
  
          {/* ✅ Avatar preview (clickable, inside form) */}
          <img
            className="registration-profile-pic"
            src={selectedImage ? URL.createObjectURL(selectedImage) : avatar}
            alt="Profile Preview"
            onClick={() => inputFileRef.current?.click()}
            style={{ cursor: "pointer" }}
          />
  
          {/* ✅ Hidden file input (inside form, registered with RHF) */}
          <input
            {...restRegisterParams}
            ref={(element) => {
              inputFileRef.current = element;
              ref(element); // This connects to react-hook-form
            }}
            type="file"
            accept="image/png, image/jpeg"
            style={{ display: "none" }}
          />
  
          {errors.img && <p className="error-text">{errors.img.message}</p>}
            <br></br>
          {/* Email */}
          <label>Email:</label>
          <input {...register("email")} type="text" className="registration-input" />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
  
          {/* Username */}
          <label>Username:</label>
          <input {...register("username")} type="text" className="registration-input" />
          {errors.username && <p className="error-text">{errors.username.message}</p>}
  
          {/* Password */}
          <label>Password:</label>
          <input {...register("password")} type="password" className="registration-input" />
          {errors.password && <p className="error-text">{errors.password.message}</p>}
  
          {/* Submit Button */}
          <button type="submit" className="registration-button">Register</button>
        </form>
  
        {/* Navigation to login */}
        <button className="registration-register-button" onClick={() => navigate("/login")}>
          Go to Login
        </button>
  
        {/* Google Login */}
        <div className="registration-google-button">
          <GoogleLogin onSuccess={onGoogleRegisterSuccess} onError={onGoogleFailure} />
        </div>
      </div>
    </div>
  );
  
    };

export default RegistrationForm