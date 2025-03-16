import { FC, useEffect, useState } from 'react'
import avatar from '../assets/avatar.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import userService, { User } from '../services/user_service'
import { useNavigate } from "react-router-dom"
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'


interface FormData {
    email: string
    password: string
    img: File[]
}
const RegistrationForm: FC = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    // const inputFileRef = useRef<HTMLInputElement>(null)
    const { register, handleSubmit, watch } = useForm<FormData>()
    const [img] = watch(["img"])
    const inputFileRef: { current: HTMLInputElement | null } = { current: null }
    const navigate = useNavigate()

    const onSubmit = (data: FormData) => {
        console.log(data)
        const { request } = userService.uploadImage(data.img[0])
        request.then((response) => {
            console.log(response.data)
            const user: User = {
                email: data.email,
                password: data.password,
                imgUrl: response.data.url
            }
            console.log("Image Data:", data.img);
            const { request } = userService.register(user)
            request.then((response) => {
                console.log(response.data)
                if(response.status == 200){
                    navigate("/login")
                }
            }).catch((error) => {
                console.error(error)
            })
        }).catch((error) => {
            console.error(error)
        })
    }

    useEffect(() => {
        if (img != null && img[0]) {
            setSelectedImage(img[0])
        }
    }, [img]);
    const { ref, ...restRegisterParams } = register("img")

    const onGoogleLoginSuccess = (credentialResponse: CredentialResponse)=>{
        console.log(credentialResponse)
    }

    const onGoogleLoginFailure = ()=>{
        console.log("Google login failure")
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100vw'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'lightgray',
                    padding: '10px',
                    margin: '10px',
                    borderRadius: '5px',
                    width: '50%',
                    justifyContent: 'center',
                    gap: '5px'
                }}>
                    <h2 style={{ alignSelf: 'center' }}>Registration Form Prod</h2>
                    <img style={{ width: '200px', height: '200px', alignSelf: 'center' }}
                        src={selectedImage ? URL.createObjectURL(selectedImage) : avatar}
                    >
                    </img>
                    <div style={{ alignSelf: 'end' }}>
                        <FontAwesomeIcon className="fa-xl" icon={faImage} onClick={() => { inputFileRef.current?.click() }} />
                    </div>

                    <input ref={(item) => { inputFileRef.current = item; ref(item) }} {...restRegisterParams} type="file" accept='image/png, image/jpeg' style={{ display: 'none' }} />
                    <label>email:</label>
                    <input {...register("email")} type="text" className='form-control' />
                    <label>password:</label>
                    <input {...register("password")} type="password" className='form-control' />
                    <button type="submit" className="btn btn-outline-primary mt-3" >Register</button>
                    <button
                        style={{
                        marginTop: "10px",
                        backgroundColor: "blue",
                        color: "white",
                        padding: "10px",
                        border: "none",
                        cursor: "pointer",
                        }}
                        onClick={() => navigate("/login")}
                        type="button" // Prevents accidental form submission
                    >
                        Go to Login
                    </button>

                    <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure}>

                    </GoogleLogin>
                </div>
            </div>
        </form>
    )
}

export default RegistrationForm