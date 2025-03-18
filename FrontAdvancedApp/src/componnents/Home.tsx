import { FC, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import user_service from "../services/user_service";
import PostList from "./PostsList";

const Home: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state
  console.log("home user:     ",user.email)
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

      <PostList user={user} />

      <button onClick={()=>{
            navigate("/profile",{state:user})
        }
      }>My Profile</button>

      <button onClick={() => navigate("/create-post")}>
           Create New Post
      </button>


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
