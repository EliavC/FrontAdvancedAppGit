import { CredentialResponse } from "@react-oauth/google";
import apiClient, { CanceledError } from "./api-client";
import axios from "axios";


export { CanceledError }

export interface User {
    username:string,
    email: string;
    password: string;
    _id?: string;
    refreshToken?: string;
    imgUrl?: string;
    accessToken?: string;
  }

  export const getUserById = async (userId: string) => {
    try {
        const response = await apiClient.get(`/auth/users/${userId}`);
        return response.data.user;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};
export const getUserImgById = async (userId: string) => {
    try {
        const response = await apiClient.get(`/auth/users/${userId}`);
        return response.data.imgUrl;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};
    export const getUserNameById = async (userId: string) => {
        try {
            const response = await apiClient.get(`/auth/users/${userId}`);
            return response.data.username;
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;    
        }    
        
};


const getUserByUsername = async(username:string) =>{
  try{
    console.log("1    ",username)
    const response = await apiClient.get('/auth/username',{params:{username}})
    console.log(" 4   ",response.data)
    return response.data
  }catch (error) {
    console.error("Error fetching user data:", error);
    return null;
}
}

const register = async (user: User) => {
  try {
    const response = await apiClient.post<User>('/auth/register', user);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data; // Throws the error message/object from backend
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
};


// const register = async (user: User) => {
  
//     const abortController = new AbortController()
//     console.log("1:     ")
//     const request = await apiClient.post<User>('/auth/register',
//         user,
//         { signal: abortController.signal })
//         console.log("request:     ",request)
//         if(request.data.username == "" || request.data.email==""){
//           return -1
//         }
//     return { request, abort: () => abortController.abort() }
// }

 const registerWithGoogle = async (credentialResponse: CredentialResponse) => {
    try {
      console.log('2')
      const response = await apiClient.post("/auth/google", { credential: credentialResponse.credential });
      console.log('after axios')
      if(response.data.email == ""){
        return -1
      }
      return response.data; 
    } catch (error) {
      console.error("Google OAuth Error:", error);
      throw error; 
    }
};

const loginWithGoogle = async (credentialResponse: CredentialResponse) => {
  try {
    console.log('2')
    const response = await apiClient.post("/auth/googleLog", { credential: credentialResponse.credential });
    console.log('after axios')
    if(response.data.token == ""){
      return -1
    }
    return response.data; 
  } catch (error) {
    console.error("Google OAuth Error:", error);
    throw error; 
  }
};

  const logIn = async (user: User) => {
    try {
      const response = await apiClient.post<{ accessToken: string; refreshToken: string }>(
        "/auth/login",
        user
      );
  
      if (response.data.accessToken && response.data.refreshToken) {
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(user));//////////eli addd
      }
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const updateProfile = async(user:User)=>{
    try {
      const abortController = new AbortController();
      const response = await apiClient.put(
          "/auth/userUpdate",
          {user}, 
          { signal: abortController.signal }
      );
     
      return { response, abort: () => abortController.abort() };
  } catch (error) {
    throw error;
      return null;
  }
  }
  
  // const refreshAccessToken = async () => {
  //   try {
  //     const refreshToken = localStorage.getItem("refreshToken");
  //     if (!refreshToken) throw new Error("No refresh token found.");
  
  //     const response = await apiClient.post<{ accessToken: string }>("/auth/refresh", {
  //       refreshToken,
  //     });
  
  //     localStorage.setItem("token", response.data.accessToken);
  //     return response.data.accessToken;
  //   } catch (error) {
  //     console.error("Failed to refresh token:", error);
  //     logout();
  //     return null;
  //   }
  // };

  const refreshAccessToken = async () => {
    try {
        const response = await apiClient.post<{ accessToken: string }>("/auth/refresh", {}); // No need to send token manually
        localStorage.setItem("token", response.data.accessToken);
        return response.data.accessToken;
    } catch (error) {
        console.error("Failed to refresh token:", error);
        logout();
        return null;
    }
};

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");//////////eli addd
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  };

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




export default { 
    register, 
    uploadImage ,
    logIn,
    logout,
    refreshAccessToken,
    registerWithGoogle,
    getUserById,
    getUserImgById,
    loginWithGoogle
    ,getUserNameById, 
    getUserByUsername,
    updateProfile
    
};