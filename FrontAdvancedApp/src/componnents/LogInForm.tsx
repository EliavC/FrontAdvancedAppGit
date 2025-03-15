import {useForm} from 'react-hook-form'
import z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import userService from '../services/user_service'

const schema = z.object({
    email:z.string().email("Invalid email format"),
    password:z.string().min(1)
})

type FormData = z.infer<typeof schema>

interface User{
    email: string,
    password: string
}

const LogInForm : React.FC = () =>{
    const [errorMessage,setErrorMessage] = useState<string | null>(null)

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
          </form>
        </div>
      );
}

export default LogInForm