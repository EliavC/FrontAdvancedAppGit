import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostList from "./PostsList";

/**
 * By removing `useLocation()` and reading from localStorage,
 * we ensure a valid user object is present if they're logged in.
 */
const Home: FC = () => {
  const navigate = useNavigate();

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

  // Optional: debug
  console.log("Home user:", user);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to the Home Page</h1>
      <p>You are successfully logged in.</p>

      {/* Pass the user to PostList. No more "missing user._id" errors */}
      {user && <PostList user={user} />}

      <button
        onClick={() => {
          // Navigate to profile, optionally passing user in state if you want:
          navigate("/profile", { state: user });
        }}
      >
        My Profile
      </button>

      <button onClick={() => navigate("/create-post")}>Create New Post</button>

      <button
        onClick={() => {
          // Clear everything on logout
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
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
