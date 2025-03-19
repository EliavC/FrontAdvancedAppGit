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

    // If we have a refreshToken cookie, try an auto-login flow
    if (document.cookie.includes("refreshToken")) {
      autoLogin();
    }
  }, []);

  // Replace the onSubmit method with this fixed version
const onSubmit = async (data: FormData) => {
  try {
    setErrorMessage(null);
    const response = await userService.logIn({ email: "", ...data });

    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);

      const newUserArr = await userService.getUserByUsername(data.username);
      const actualUser = newUserArr && newUserArr.length > 0 ? newUserArr[0] : null;
      if (!actualUser) {
        setErrorMessage("No user found for that username.");
        return;
      }
      localStorage.setItem("user", JSON.stringify(actualUser));
      navigate("/home", { state: actualUser });
    } else {
      setErrorMessage("Invalid response from server.");
    }
  } catch (error: any) {
    setErrorMessage(error.response?.data?.message || "Invalid username or password.");
  }
};



  // 1) Normal username/password login
  // const onSubmit = async (data: FormData) => {
  //   try {
  //     setErrorMessage(null);

  //     const user: User = {
  //       email: "",
  //       username: data.username,
  //       password: data.password,
  //     };

  //     const response = await userService.logIn(user);
  //     console.log("response:", response);
  //     if (response.data.accessToken) {
  //       setAccessToken(response.data.accessToken);

  //       // Optionally, fetch user by username
  //       const newUser = await userService.getUserByUsername(data.username);
  //       const actualUser = newUser && newUser.length > 0 ? newUser[0] : null;
  //       if (!actualUser) {
  //         setErrorMessage("No user found for that username.");
  //         return;
  //       }

  //       localStorage.setItem("user", JSON.stringify(actualUser));
  //       navigate("/home", { state: actualUser });
  //     } else {
  //       setErrorMessage("Invalid response from server.");
  //     }
  //   } catch (error: any) {
  //     console.error("Login error:", error);
  //     setErrorMessage(
  //       error.response?.data?.message || "Invalid username or password."
  //     );
  //   }
  // };

  // 2) Google login callback
  const loginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      // 2.1) Attempt to "register with Google"
      // if user doesn't exist, your server will create them
      // if user does exist, your server returns empty fields
      const data = await userService.registerWithGoogle(credentialResponse);
      console.log("googleRegister response:", data);

      // If the user was newly created, you might get data.accessToken, data.username, etc.
      if (data.accessToken) {
        // brand-new Google user
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        // If you want to fetch them from DB by username, do so:
        if (!data.username) {
          setErrorMessage("No username from Google response.");
          return;
        }
        const existingUserArr = await userService.getUserByUsername(data.username);
        const actualUser =
          existingUserArr && existingUserArr.length > 0
            ? existingUserArr[0]
            : null;

        if (!actualUser) {
          setErrorMessage("No user found for that username. (Google new user)");
          return;
        }

        localStorage.setItem("user", JSON.stringify(actualUser));
        navigate("/home");
      } else {
        // 2.2) Means the server returned empty fields => user already exists
        // => Let's do the second call to "loginWithGoogle"
        console.log("User probably already existed, calling googleLogIn...");
        const loginData = await userService.loginWithGoogle(credentialResponse);
        console.log("googleLogIn response:", loginData);

        if (loginData.accessToken) {
          // Now we have tokens for the existing user
          localStorage.setItem("token", loginData.accessToken);
          localStorage.setItem("refreshToken", loginData.refreshToken);

          // If we want to fetch DB user by username:
          if (!loginData.username) {
            setErrorMessage("No username from googleLogIn response.");
            return;
          }
          const existingUserArr = await userService.getUserByUsername(
            loginData.username
          );
          const actualUser =
            existingUserArr && existingUserArr.length > 0
              ? existingUserArr[0]
              : null;

          if (!actualUser) {
            setErrorMessage("No user found for that username. (Google existing user)");
            return;
          }

          localStorage.setItem("user", JSON.stringify(actualUser));
          navigate("/home");
        } else {
          // If googleLogIn also fails to give tokens, we show an error
          setErrorMessage(
            "Google sign-in failed or user already exists but we can't log you in."
          );
        }
      }
    } catch (err) {
      console.log("Google login error", err);
      setErrorMessage("Google login error");
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
        <input
          {...register("username")}
          type="text"
          placeholder="Username"
        />
        {errors.username && (
          <p style={{ color: "red" }}>{errors.username.message}</p>
        )}

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
        />
        {errors.password && (
          <p style={{ color: "red" }}>{errors.password.message}</p>
        )}

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

        {/* Google login button */}
        <GoogleLogin onSuccess={loginSuccess} onError={loginFailed} />
      </form>
    </div>
  );
};

export default LogInForm;
