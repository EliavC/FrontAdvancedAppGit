import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostList from "./PostsList";
import openaiService from "../services/openai-service";
import "./profileHome.css";

/**
 * By removing `useLocation()` and reading from localStorage,
 * we ensure a valid user object is present if they're logged in.
 */
const Home: FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  // Load user from localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const token = localStorage.getItem("token");
    // If no token or no user ID => not logged in
    if (!token || !user?._id) {
      navigate("/login");
    }
  }, [navigate, user]);

  const handleAskAI = async()=>{
    if (!prompt) return;
    setLoading(true)
    setAiResponse("")
    try {
      const response = await openaiService.sendPromptToAI(prompt);
      setAiResponse(response);
    } catch (err: any) {
      setAiResponse(typeof err === "string" ? err : "Something went wrong.");
    }
    setLoading(false);
  };


  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome, {user?.username}</h1>
        <p>You are successfully logged in.</p>
      </header>
  
      <div className="post-list-container">
        {user && <PostList user={user} />}
      </div>
  
      <div className="home-buttons">
        <button className="home-btn" onClick={() => navigate("/profile", { state: user })}>
          My Profile
        </button>
  
        <button className="home-btn" onClick={() => navigate("/create-post", { state: user })}>
          Create New Post
        </button>
  
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
  
      {/* 👉 Add this below the buttons */}
      <div className="ai-chat-box" style={{ marginTop: "40px" }}>
        <h2>Ask AI Something</h2>
        <textarea
          placeholder="Ask OpenAI a question..."
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            resize: "vertical",
          }}
        />
        <button
          onClick={handleAskAI}
          disabled={loading}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>
  
        {aiResponse && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#f4f4f4",
              borderRadius: "5px",
              whiteSpace: "pre-wrap",
              border: "1px solid #ccc",
            }}
          >
            <strong>AI Response:</strong>
            <br />
            {aiResponse}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
