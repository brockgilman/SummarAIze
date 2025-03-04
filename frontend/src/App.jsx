import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import Router and Routes
import Home from './app/Homepage';  // Import your Home component
import Dashboard from './app/Dashboard';  // Create and import a Dashboard component (or any other page you want to redirect to)

function App() {
  return (
    <Router>
      <div className="h-screen">
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home page */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* Success page or dashboard */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
