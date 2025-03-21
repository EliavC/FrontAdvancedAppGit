import "./styles.css"
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import userService from "../services/user_service";
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.webp";
import image5 from "../assets/image5.webp";

// Store images in an array
const images = [image1, image2, image3, image4, image5];

// Validation schema
const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

const LogInForm: React.FC<{ setUser: (user: any) => void }> = ({ setUser }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });


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
    console.log("Google login response:", credentialResponse);

    if (!credentialResponse?.credential) {
        console.error("No credential received");
        setErrorMessage("Google login failed: No credential received.");
        return;
    }

    try {
        const data = await userService.loginWithGoogle(credentialResponse);
        console.log("Google API response:", data); // Debugging

        if (!data || !data.accessToken) {
            console.error("Google login error: No access token returned", data);
            setErrorMessage("Google login failed. No access token received.");
            return;
        }

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
        navigate("/home", { state: actualUser });
    } catch (err) {
        console.error("Google login error:", err);
        setErrorMessage("Google login error. Please try again.");
    }
};
  // const loginSuccess = async (credentialResponse: CredentialResponse) => {
  //   try {
  //     const data = await userService.registerWithGoogle(credentialResponse);
  //     console.log("data    ",data)
  //     if (data.accessToken) {
  //       localStorage.setItem("token", data.accessToken);
  //       localStorage.setItem("refreshToken", data.refreshToken);

  //       if (!data.username) {
  //         setErrorMessage("No username from Google response.");
  //         return;
  //       }

  //       const existingUserArr = await userService.getUserByUsername(data.username);
  //       const actualUser = existingUserArr?.length > 0 ? existingUserArr[0] : null;

  //       if (!actualUser) {
  //         setErrorMessage("No user found for that username. (Google new user)");
  //         return;
  //       }

  //       localStorage.setItem("user", JSON.stringify(actualUser));
  //       setUser(actualUser);
  //       navigate("/home",{state:actualUser});
  //     } else {
  //       setErrorMessage("Google sign-in failed or user already exists but we can't log you in.");
  //     }
  //   } catch (err) {
  //     setErrorMessage("Google login error");
  //   }
  // };

  const loginFailed = () => {
    console.log("Google login failure");
  };

  return (
    <div className={`container ${fade ? "fade-in" : "fade-out"}`} style={{ backgroundImage: `url(${images[currentImage]})` }}>
      <div className="overlay"></div> 

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

          <p className="register-text">Don't have an account?</p>
          <button className="register-button" onClick={() => navigate("/register")}>Go to Register</button>

          <p className="divider">Or continue with</p>

          <div className="google-button">
            <GoogleLogin onSuccess={loginSuccess} onError={() => console.log("Google login failure")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInForm;
