import {useForm} from 'react-hook-form'
import z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import userService,{User} from '../services/user_service'
import { useNavigate } from "react-router-dom";


const schema = z.object({
    email:z.string().email("Invalid email format"),
    password:z.string().min(1)
})

type FormData = z.infer<typeof schema>

const LogInForm : React.FC = () =>{
    const [errorMessage,setErrorMessage] = useState<string | null>(null)
    const navigate = useNavigate();
    const{
        register,
        handleSubmit,
        formState:{errors},
    } = useForm<FormData> ({
        resolver:zodResolver(schema)
    })

    const onSubmit = async(data:FormData)=>{
        try{
            setErrorMessage(null);
            const user:User = {
                email:data.email,
                password:data.password
            }
            const {request} = userService.logIn(user)
            request.then((response) =>{
                console.log(response.status)
                console.log(response.data)
                if(response.data.refreshToken && response.data.accessToken){
                    localStorage.setItem("refreshTokens",response.data.refreshToken)
                    localStorage.setItem("token",response.data.accessToken)
                    navigate('/home')
                }
                
            })
        }catch(error){
            console.log(error)
        }
    
    }


    return (
        <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
          <h2>Login</h2>
          
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("email")} type="email" placeholder="Email" />
            {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
    
            <input {...register("password")} type="password" placeholder="Password" />
            {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}

            <button type="submit">Login</button>

            <button
        style={{ marginTop: "10px", backgroundColor: "blue", color: "white", padding: "10px", border: "none", cursor: "pointer" }}
        onClick={() => navigate("/register")}>
        Go to Register
      </button>
          </form>
        </div>
      );
}

export default LogInForm