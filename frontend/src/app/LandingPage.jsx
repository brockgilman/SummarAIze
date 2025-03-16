import './globals.css';
import SignupButtons from "../components/SignupButtons";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <Navbar />
      
      <style jsx>{`
        .landing-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
          position: relative;
        }

        .content-container {
          display: flex;
          flex-direction: column;
        }

        .text-content {
          width: 70%;  /* Make text content occupy 70% of the screen width */
          max-width: 900px;  /* Keep a reasonable maximum width */
          margin: 0 auto;  /* Center the text */
        }

        .gif-container {
          margin-top: 2rem;
          margin-left: 15%;  /* Adjust margin so the GIF is aligned to the right */
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .gif-image {
          width:250%;  /* Make the GIF larger */
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        @media (min-width: 992px) {
          .content-container {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
            gap: 2rem;
          }

          .text-content {
            width: 60%;  /* Increase width on larger screens for more space */
            max-width: 1000px;
          }

          .gif-container {
            flex: 1;
            margin-top: 0;
            margin-left: 15%;  /* Adjust the left margin for the GIF */
            justify-content: flex-start;
            align-items: center;
          }
        }
      `}</style>
      
      <div className="landing-container">
        <div className="content-container">
          <div className="text-content">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8 text-gray-900">
              AI-powered summaries<br />
              that enhance your<br />
              understanding and<br />
              accelerate your learning.
            </h1>

            <p className="text-2xl md:text-3xl mb-10 text-gray-700">
              Work with an AI partner that helps you extract key insights⁠—⁠to simplify long articles, clarify challenging content, and keep your reading efficient.
            </p>

            <div>
              <SignupButtons />
            </div>

            <div className="mt-6">
              <p className="text-2xl text-gray-700">By: Brock Gilman, Kyle Scarmack, Shri Kumarasri, and Leo Cherevko</p>
            </div>
          </div>
          
          <div className="gif-container">
            <img 
              src="summarizeimportant.gif" 
              alt="SummarAlze Demo" 
              className="gif-image"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
