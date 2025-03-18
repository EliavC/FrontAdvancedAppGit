import RegistrationForm from "./RegistrationForm";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LogInForm from "./LogInForm";
import Home from "./Home";
import CommentsList from "./CommentsList"; // ✅ Ensure correct import
import Profile from "./Profile";
import PostsList from "./PostsList"; // ✅ Ensure correct import
import CreatePost from "./CreatePost"; // ✅ Import CreatePost component

function App() {
    // ✅ Fetch user from localStorage or state (Modify as needed)
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");// Ensure user is stored in localStorage after login

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/login" element={<LogInForm />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* ✅ Pass user to PostsList */}
                <Route path="/posts" element={<PostsList user={storedUser} />} />

                {/* ✅ Ensure correct comments route */}
                <Route path="/comments/:postId" element={<CommentsList />} />
                <Route path="/create-post" element={<CreatePost user={storedUser} />} />
                
            </Routes>
        </Router>
    );
}

export default App;
