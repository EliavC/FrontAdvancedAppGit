

// import { useForm } from "react-hook-form";
// import z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";
// import userService from "../services/user_service";
// import { useNavigate } from "react-router-dom";
// import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

// const schema = z.object({
//   username: z.string().min(1, "Username is required"),
//   password: z.string().min(1, "Password is required"),
// });

// type FormData = z.infer<typeof schema>;

// const LogInForm: React.FC<{ setUser: (user: any) => void }> = ({ setUser }) => {
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
//     resolver: zodResolver(schema),
//   });
//   const onSubmit = async (data: FormData) => {
//     try {
//       setErrorMessage(null);

//       const response = await userService.logIn({ email: "", ...data });

//       if (response.data.accessToken) {
//         localStorage.setItem("token", response.data.accessToken);

//         const newUserArr = await userService.getUserByUsername(data.username);

//         const actualUser = newUserArr && newUserArr.length > 0 ? newUserArr[0] : null;
//         if (!actualUser) {
//           setErrorMessage("No user found for that username.");
//           return;
//         }

//         localStorage.setItem("user", JSON.stringify(actualUser));
//         setUser(actualUser); 

//         navigate("/home", { state: actualUser });
//       } else {
//         setErrorMessage("Invalid response from server.");
//       }
//     } catch (error: any) {
//       setErrorMessage(error.response?.data?.message || "Invalid username or password.");
//     }
//   };

//   const loginSuccess = async (credentialResponse: CredentialResponse) => {
//     try {
      
//       const data = await userService.registerWithGoogle(credentialResponse);

//       if (data.accessToken) {
//         localStorage.setItem("token", data.accessToken);
//         localStorage.setItem("refreshToken", data.refreshToken);

//         if (!data.username) {
//           setErrorMessage("No username from Google response.");
//           return;
//         }

//         const existingUserArr = await userService.getUserByUsername(data.username);
//         const actualUser = existingUserArr.length > 0 ? existingUserArr[0] : null;

//         if (!actualUser) {
//           setErrorMessage("No user found for that username. (Google new user)");
//           return;
//         }

//         localStorage.setItem("user", JSON.stringify(actualUser));
//         setUser(actualUser);
//         navigate("/home");
//       } else {
//         const loginData = await userService.loginWithGoogle(credentialResponse);

//         if (loginData.accessToken) {
//           localStorage.setItem("token", loginData.accessToken);
//           localStorage.setItem("refreshToken", loginData.refreshToken);

//           if (!loginData.username) {
//             setErrorMessage("No username from googleLogIn response.");
//             return;
//           }

//           const existingUserArr = await userService.getUserByUsername(loginData.username);
//           const actualUser = existingUserArr.length > 0 ? existingUserArr[0] : null;

//           if (!actualUser) {
//             setErrorMessage("No user found for that username. (Google existing user)");
//             return;
//           }

//           localStorage.setItem("user", JSON.stringify(actualUser));
//           setUser(actualUser);
//           navigate("/home");
//         } else {
//           setErrorMessage("Google sign-in failed or user already exists but we can't log you in.");
//         }
//       }
//     } catch (err) {
//       setErrorMessage("Google login error");
//     }
//   };

 
//   const loginFailed = () => {
//     console.log(" Google login failure");
//   };

//   return (
//     <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
//       <h2>Login</h2>
//       {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      
      
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <input {...register("username")} type="text" placeholder="Username" />
//         {errors.username && <p style={{ color: "red" }}>{errors.username.message}</p>}
        
//         <input {...register("password")} type="password" placeholder="Password" />
//         {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
        
//         <button type="submit">Login</button>
//       </form>

     
//       <div style={{ margin: "10px 0" }}>
//         <GoogleLogin onSuccess={loginSuccess} onError={loginFailed} />
//       </div>

     
//       <button
//         style={{
//           marginTop: "10px",
//           backgroundColor: "blue",
//           color: "white",
//           padding: "10px",
//           border: "none",
//           cursor: "pointer",
//         }}
//         onClick={() => navigate("/register")}
//       >
//         Go to Register
//       </button>
//     </div>
//   );
// };

// export default LogInForm;
import bgImage from "../assets/motorcycleSignIn.webp";
import "./styles.css"
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import userService from "../services/user_service";
import styled from "styled-components";

// Validation schema
const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

const LogInForm: React.FC<{ setUser: (user: any) => void }> = ({ setUser }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setErrorMessage(null);
      const response = await userService.logIn({ email: "", ...data });

      if (response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);

        const newUserArr = await userService.getUserByUsername(data.username);
        const actualUser = newUserArr?.length > 0 ? newUserArr[0] : null;

        if (!actualUser) {
          setErrorMessage("No user found for that username.");
          return;
        }

        localStorage.setItem("user", JSON.stringify(actualUser));
        setUser(actualUser);
        navigate("/home", { state: actualUser });
      } else {
        setErrorMessage("Invalid response from server.");
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Invalid username or password.");
    }
  };

  const loginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const data = await userService.registerWithGoogle(credentialResponse);

      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        if (!data.username) {
          setErrorMessage("No username from Google response.");
          return;
        }

        const existingUserArr = await userService.getUserByUsername(data.username);
        const actualUser = existingUserArr?.length > 0 ? existingUserArr[0] : null;

        if (!actualUser) {
          setErrorMessage("No user found for that username. (Google new user)");
          return;
        }

        localStorage.setItem("user", JSON.stringify(actualUser));
        setUser(actualUser);
        navigate("/home");
      } else {
        setErrorMessage("Google sign-in failed or user already exists but we can't log you in.");
      }
    } catch (err) {
      setErrorMessage("Google login error");
    }
  };

  const loginFailed = () => {
    console.log("Google login failure");
  };

  return (
    <div className="container">
      <div className="left-side">
        <h1>
          SIGN IN TO YOUR <span>ADVENTURE!</span>
        </h1>
      </div>

      <div className="right-side">
        <div className="signin-container">
          <h2>SIGN IN</h2>
          <p>Sign in with email address</p>

          {errorMessage && <p className="error-text">{errorMessage}</p>}

          <form className="form" onSubmit={handleSubmit(onSubmit)}>
                <input {...register("username")} type="text" placeholder="Username" className="input" />
                {errors.username && <p className="error-text">{errors.username.message}</p>}

                <input {...register("password")} type="password" placeholder="Password" className="input" />
                {errors.password && <p className="error-text">{errors.password.message}</p>}

                <button type="submit" className="button">Sign In</button>
              </form>

              <p className="divider">Or continue with</p>

              <div className="google-button">
                <GoogleLogin onSuccess={loginSuccess} onError={loginFailed} />
              </div>

              <p className="register-text">Don't have an account?</p>
              <button className="register-button" onClick={() => navigate("/register")}>Go to Register</button>

        </div>
      </div>
    </div>
  );

};

export default LogInForm;
