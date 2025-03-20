import React from 'react';
import TextBox from "../components/Textbox";
import LogoNavbar from '../components/LogoNavbar';


const HomePage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-blue-100">
      <LogoNavbar />
      <h1>Saved Summaries</h1>
    </div>
  );
};

export default HomePage;