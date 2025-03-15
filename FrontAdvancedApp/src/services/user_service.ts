import apiClient, { CanceledError } from "./api-client";


export { CanceledError }

export interface User {
    _id?: string,
    email: string,
    password: string,
    imgUrl?: string
}

const register = (user: User) => {
    const abortController = new AbortController()
    const request = apiClient.post<User>('/auth/register',
        user,
        { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

const logIn = (user:User)=>{
    const abortController = new AbortController()
    const request = apiClient.post<User>('/auth/login',
        user,
        {signal:abortController.signal}
    )
    return{request,abort:()=>abortController.abort}
}

const uploadImage = (img: File) => {
    // const abortController = new AbortController()
    const formData = new FormData();
    formData.append("file", img);
    const request = apiClient.post('/file?file=' + img.name, formData, {
        headers: {
            'Content-Type': 'image/*'
        }
    })
    return { request }
}




export default { register, uploadImage ,logIn}