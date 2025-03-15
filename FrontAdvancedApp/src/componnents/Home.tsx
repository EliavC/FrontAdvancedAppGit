import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import user_service from "../services/user_service";
import ItemsList from "./ItemsList";
import PostList from "./PostsList";

const Home: FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);


  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to the Home Page</h1>
      <p>You are successfully logged in.</p>

      <PostList
        
      />

      <button
        onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
          navigate("/login"); 
        }}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
