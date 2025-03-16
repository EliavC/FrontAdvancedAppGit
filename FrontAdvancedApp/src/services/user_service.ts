import { CredentialResponse } from "@react-oauth/google";
import apiClient, { CanceledError } from "./api-client";


export { CanceledError }

export interface User {
    email: string;
    password: string;
    _id?: string;
    refreshToken?: string;
    imgUrl?: string;
    accessToken?: string;
  }

const register = (user: User) => {
    const abortController = new AbortController()
    const request = apiClient.post<User>('/auth/register',
        user,
        { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

const registerWithGoogle = (credentialResponse: CredentialResponse) => {
  return new Promise<User>((resolve,reject)=>{
     apiClient.post<User>('/auth/google',credentialResponse).then((response)=>{
        resolve(response.data)
      })
        .catch((error)=>{
          reject(error)
        })
      })
}

  const logIn = async (user: User) => {
    try {
      const response = await apiClient.post<{ accessToken: string; refreshToken: string }>(
        "/auth/login",
        user
      );
  
      if (response.data.accessToken && response.data.refreshToken) {
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };
  
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token found.");
  
      const response = await apiClient.post<{ accessToken: string }>("/auth/refresh", {
        refreshToken,
      });
  
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




export default { register, uploadImage ,logIn,logout,refreshAccessToken,registerWithGoogle}