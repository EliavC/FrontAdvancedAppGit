import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home: FC = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to the Home Page</h1>
      <p>You are successfully logged in.</p>

      <button
        onClick={() => {
          localStorage.removeItem("token");
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
