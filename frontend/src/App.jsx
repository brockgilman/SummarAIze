import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import Router and Routes
import LandingPage from './app/LandingPage';  // Import your LandingPage component
import HomePage from './app/HomePage';  // Create and import a HomePage component (or any other page you want to redirect to)
import SignUp from './components/sign-up/SignUp';

function App() {
  return (
    <Router>
      <div className="h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* Landing page */}
          <Route path="/dashboard" element={<HomePage />} /> {/* Success page or home page */}
          <Route path="/signup" element={<SignUp />} /> {/* Signup page */}
        
        </Routes>
      </div>
    </Router>
  );
}

export default App;
