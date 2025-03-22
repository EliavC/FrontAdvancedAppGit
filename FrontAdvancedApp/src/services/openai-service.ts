import apiClient from "./api-client";

interface AIResponse{
    response:string
}

const sendPromptToAI = async (prompt:string):Promise<string> =>{
    try{
        const res = await apiClient.post<AIResponse>("/openai/generate",{
            prompt
        })
        return res.data.response;
    }catch (error: any) {
        console.error("AI error:", error);
        throw error.response?.data?.error || "Failed to contact AI";
    }
}

const openaiService = {
    sendPromptToAI,
  };

  export default openaiService