
import RegistrationForm from "./RegistrationForm"


import { BrowserRouter as Router, Route, Routes ,Navigate} from "react-router-dom";
import LogInForm from "./LogInForm"
import Home from "./Home"
import Post from "./Post";
import PostList from "./PostsList";

function App() {
  return (
  
    <Router>
      <Routes>
        <Route path ="/" element={<Navigate to= "/login"/>}/>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LogInForm />} /> 
        <Route path="/home" element={<Home/>} /> 
      </Routes>
    </Router>
  );
}
export default App;
