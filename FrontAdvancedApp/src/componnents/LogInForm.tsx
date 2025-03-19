
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import userService from "../services/user_service";
import { useNavigate } from "react-router-dom";

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
      console.log("🔍 Logging in user:", data.username);
      setErrorMessage(null);

      const response = await userService.logIn({ email: "", ...data });

      if (response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);

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
      </form>

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
      >
        Go to Register
      </button>
    </div>
  );
};

export default LogInForm;
