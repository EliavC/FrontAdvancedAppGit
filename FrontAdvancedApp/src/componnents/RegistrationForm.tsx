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
          }, 500); // Wait for fade-out before changing image
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


    // return (
    //     <form onSubmit={handleSubmit(onSubmit)}>
    //       <div
    //         style={{
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //           height: "100vh",
    //           width: "100vw",
    //         }}
    //       >
    //         <div
    //           style={{
    //             display: "flex",
    //             flexDirection: "column",
    //             backgroundColor: "lightgray",
    //             padding: "10px",
    //             margin: "10px",
    //             borderRadius: "5px",
    //             width: "50%",
    //             justifyContent: "center",
    //             gap: "5px",
    //           }}
    //         >
    //           <h2 style={{ alignSelf: "center" }}>Registration Form</h2>
    
    //           {/* Show any server error messages */}
    //           {errorMessage && (
    //             <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
    //           )}
    
    //           {/* Avatar preview */}
    //           <img
    //             style={{ width: "200px", height: "200px", alignSelf: "center" }}
    //             src={selectedImage ? URL.createObjectURL(selectedImage) : avatar}
    //             alt="Profile Preview"
    //           />
    
    //           <div style={{ alignSelf: "end" }}>
    //             <i
    //               onClick={() => inputFileRef.current?.click()}
    //               style={{ cursor: "pointer" }}
    //             >
    //               Upload Icon
    //             </i>
    //           </div>
    
    //           <input
    //             ref={(item) => {
    //               inputFileRef.current = item;
    //               ref(item);
    //             }}
    //             {...restRegisterParams}
    //             type="file"
    //             accept="image/png, image/jpeg"
    //             style={{ display: "none" }}
    //           />
    //           {errors.img && <p style={{ color: "red" }}>{errors.img.message}</p>}
    
    //           {/* Email */}
    //           <label>Email:</label>
    //           <input {...register("email")} type="text" />
    //           {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
    
    //           {/* Username */}
    //           <label>Username:</label>
    //           <input {...register("username")} type="text" />
    //           {errors.username && <p style={{ color: "red" }}>{errors.username.message}</p>}
    
    //           {/* Password */}
    //           <label>Password:</label>
    //           <input {...register("password")} type="password" />
    //           {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
    
    //           {/* Submit */}
    //           <button type="submit">Register</button>
    
    //           {/* Link to Login */}
    //           <button
    //             style={{
    //               marginTop: "10px",
    //               backgroundColor: "blue",
    //               color: "white",
    //               padding: "10px",
    //               border: "none",
    //               cursor: "pointer",
    //             }}
    //             onClick={() => navigate("/login")}
    //             type="button"
    //           >
    //             Go to Login
    //           </button>
    
    //           {/* Google registration if needed */}
    //           <GoogleLogin onSuccess={onGoogleRegisterSuccess} onError={onGoogleFailure} />
    //         </div>
    //       </div>
    //     </form>
    //   );
    return (
      <div className={`registration-container ${fade ? "registration-fade-in" : "registration-fade-out"}`} 
           style={{ backgroundImage: `url(${images[currentImage]})` }}>
          
          <div className="registration-overlay"></div> {/* Fading effect overlay */}

          <div className="registration-form-container">
              <h2>Registration Form</h2>

              {errorMessage && <p className="error-text">{errorMessage}</p>}

              {/* Avatar Preview */}
              <img className="registration-profile-pic"
                  src={selectedImage ? URL.createObjectURL(selectedImage) : avatar}
                  alt="Profile Preview"
              />

              <input ref={(item) => { inputFileRef.current = item; ref(item); }} {...restRegisterParams}
                  type="file" accept="image/png, image/jpeg" style={{ display: "none" }} />

              {errors.img && <p className="error-text">{errors.img.message}</p>}

              <form onSubmit={handleSubmit(onSubmit)}>
                  <label>Email:</label>
                  <input {...register("email")} type="text" className="registration-input" />
                  {errors.email && <p className="error-text">{errors.email.message}</p>}

                  <label>Username:</label>
                  <input {...register("username")} type="text" className="registration-input" />
                  {errors.username && <p className="error-text">{errors.username.message}</p>}

                  <label>Password:</label>
                  <input {...register("password")} type="password" className="registration-input" />
                  {errors.password && <p className="error-text">{errors.password.message}</p>}

                  <button type="submit" className="registration-button">Register</button>
              </form>

              <button className="registration-register-button" onClick={() => navigate("/login")}>Go to Login</button>

              <div className="registration-google-button">
                <GoogleLogin onSuccess={onGoogleRegisterSuccess} 
                             onError={onGoogleFailure} />
            </div>
          </div>
      </div>
  );
    };

export default RegistrationForm