import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './app/LandingPage';
import Summaries from './app/Summaries';
import SignUp from './app/sign-up/SignUp';
import Features from './app/Features';
import Demo from './app/Demo';
import About from './app/About';
import LogIn from './app/log-in/LogIn';
import Generate from './app/Generate';
import Trash from './app/Trash';
import Account from './app/Account';
import PrivacyPolicy from './app/PrivacyPolicy';

function App() {
  return (
    <Router>
      <div className="h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* Landing page */}
          <Route path="/summaries" element={<Summaries />} /> {/* Home page */}
          <Route path="/signup" element={<SignUp />} /> {/* Signup page */}
          <Route path="/features" element={<Features />} /> {/* Features */}
          <Route path="/demo" element={<Demo />} /> {/* Demo */}
          <Route path="/about" element={<About />} /> {/* About */}
          <Route path="/login" element={<LogIn />} /> {/* Login page */}
          <Route path="/generate" element={<Generate />} /> {/* Generate summary page */}
          <Route path="/trash" element={<Trash />} /> {/* Trash page */}
          <Route path="/account" element={<Account />} /> {/* Account page */}
          <Route path="/privacy" element={<PrivacyPolicy />} /> {/* Privacy policy page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
