
import RegistrationForm from "./RegistrationForm"
import { BrowserRouter as Router, Route, Routes ,Navigate} from "react-router-dom";
import LogInForm from "./LogInForm"

function App() {
  return (
    <Router>
      <Routes>
        <Route path ="/" element={<Navigate to= "/login"/>}/>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LogInForm />} /> 
      </Routes>
    </Router>
  );
}

export default App