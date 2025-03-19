import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import RegistrationForm from "./RegistrationForm";
import LogInForm from "./LogInForm";
import Home from "./Home";
import Profile from "./Profile";
import PostsList from "./PostsList";
import CreatePost from "./CreatePost";
import userService from "../services/user_service";
import CommentsList from "./CommentsList";

const App = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const autoLogin = async () => {
            try {
                console.log("🔍 Checking auto-login...");
                const storedUser = JSON.parse(localStorage.getItem("user") || "null");

                if (!storedUser) {
                    setUser(null);
                    return;
                }

                console.log("✅ User found in localStorage:", storedUser);

                const newToken = await userService.refreshAccessToken();
                if (newToken) {
                    console.log("✅ Token refreshed successfully");
                    localStorage.setItem("token", newToken);
                    setUser(storedUser);
                } else {
                    localStorage.removeItem("user");
                    setUser(null);
                }
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        autoLogin();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/login" element={<LogInForm setUser={setUser} />} /> 
                <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
                <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/posts" element={user ? <PostsList user={user} /> : <Navigate to="/login" />} />

                {/* ✅ Corrected here clearly */}
                <Route path="/comments/:postId" element={user ? <CommentsList user={user} /> : <Navigate to="/login" />}/>



                <Route path="/create-post" element={user ? <CreatePost /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;