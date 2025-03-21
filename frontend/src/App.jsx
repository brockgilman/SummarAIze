import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './app/LandingPage';
import HomePage from './app/HomePage';
import SignUp from './app/sign-up/SignUp';
import Features from './app/Features';
import Demo from './app/Demo';
import About from './app/About';
import SignIn from './app/sign-in/SignIn';

function App() {
  return (
    <Router>
      <div className="h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* Landing page */}
          <Route path="/homepage" element={<HomePage />} /> {/* Success page or home page */}
          <Route path="/signup" element={<SignUp />} /> {/* Signup page */}
          <Route path="/features" element={<Features />} /> {/* Features */}
          <Route path="/demo" element={<Demo />} /> {/* Demo */}
          <Route path="/about" element={<About />} /> {/* About */}
          <Route path="/login" element={<SignIn />} /> {/* Login page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
