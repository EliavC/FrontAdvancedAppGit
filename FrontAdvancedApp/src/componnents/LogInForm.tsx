

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import userService, { User } from "../services/user_service";
import { useNavigate } from "react-router-dom";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

const LogInForm: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const newToken = await userService.refreshAccessToken();
        if (newToken) {
          setAccessToken(newToken);
        }
      } catch (err) {
        console.error("Auto-login failed:", err);
        setAccessToken(null);
      }
    };

    if (document.cookie.includes("refreshToken")) {
      autoLogin();
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setErrorMessage(null);

      const user: User = {
        email:"",
        username: data.username,
        password: data.password,
      };

      const response = await userService.logIn(user); 
      console.log("response:   ", response)
      if (response.data.accessToken ) {
        setAccessToken(response.data.accessToken);
        console.log(data.username)
        const newUser = await userService.getUserByUsername(data.username)
        console.log("new User:    ",newUser)
        const userFromServer = newUser[0];//////////eli addd
        localStorage.setItem("user", JSON.stringify(userFromServer));/////eli addd
        navigate("/home",{state: newUser[0]});
      } else {
        setErrorMessage("Invalid response from server.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage(error.response?.data?.message || "Invalid username or password.");
    }
  };

  const loginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const data = await userService.registerWithGoogle(credentialResponse);
      if (data.tokens != "") {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        const newUser = await userService.getUserByUsername(data.username);///////eli add
        navigate("/home", { state: newUser[0] });//////////eli addddd
      }
    } catch (err) {
      console.log("Google login error", err);
    }
  };

  const loginFailed = async () => {
    console.log("Google login failure");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h2>Login</h2>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        
        <input {...register("username")} type="text" placeholder="Username" />
        {errors.username && <p style={{ color: "red" }}>{errors.username.message}</p>}

        <input {...register("password")} type="password" placeholder="Password" />
        {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}

        <button type="submit">Login</button>

        <button
          style={{
            marginTop: "10px",
            backgroundColor: "blue",
            color: "white",
            padding: "10px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => navigate("/register")}
          type="button"
        >
          Go to Register
        </button>


        <GoogleLogin onSuccess={loginSuccess} onError={loginFailed} />
      </form>
    </div>
  );
};

export default LogInForm;
