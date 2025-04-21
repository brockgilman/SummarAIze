# SummarAIze

SummarAIze is an AI-powered summarization tool that helps users extract key insights from long articles and complex content. Built with React and Firebase, it offers both a web interface and a Chrome extension to make content digestion more efficient and learning more effective.

![SummarAIze Demo](/frontend/public/summarAIzevideoclip.gif)

## Features

- **AI-Powered Summarization**: Generate concise summaries with adjustable tone and length
- **Chrome Extension**: Summarize content directly from any webpage
- **Customizable Output**: Choose between casual, knowledgeable, or expert tones
- **Flexible Length Options**: Select short, medium, or long summaries
- **Save & Organize**: Store summaries and organize them into notebooks

## Web Application Installation

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Firebase account

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/SummarAIze.git
cd SummarAIze
```

2. **Install dependencies**
```bash
cd frontend
npm install
```

3. **Configure Firebase**
- Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
- Enable Authentication and Firestore
- Create a web app in your Firebase project
- Copy your Firebase configuration

4. **Set up environment variables**
Create a `.env` file in the frontend directory:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

5. **Start the development server**
```bash
npm start
```

The web application should now be running at `http://localhost:5173`

![Generate Summary Interface](/frontend/public/generatesummarypic.png)

## Chrome Extension Installation

### Local Development Setup

1. **Navigate to the extension directory**
```bash
cd ChromeExt
```

2. **Install extension dependencies**
```bash
npm install
```

3. **Build the extension**
```bash
npm run build
```

4. **Load the extension in Chrome**
- Open Chrome and navigate to `chrome://extensions/`
- Enable "Developer mode" in the top right
- Click "Load unpacked"
- Select the `ChromeExt/dist` directory

![Chrome Extension Interface](/frontend/public/chromeextensionpic.png)

### Using the Extension

1. **Sign in** using your SummarAIze account credentials
2. **Navigate** to any webpage you want to summarize
3. **Select** the text you want to summarize
4. **Click** the SummarAIze extension icon
5. **Choose** your preferred tone and length
6. **Generate** your summary
7. **Save** summaries to access them later on the web platform

## Technology Stack

- **Frontend**: React, TailwindCSS
- **Backend**: Firebase (Authentication, Firestore)
- **Extension**: Chrome Extensions API
- **AI**: Groq API for text generation
- **Deployment**: Firebase Hosting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License

## Acknowledgments

- Built by UF students, for any student
- Powered by Groq's LLM API
- Special thanks to fellow initial project contributors
  - [Brock Gilman](https://github.com/brockgilman)
  - [Kyle Scarmack](https://github.com/kyleScarmack)
  - [Shrishon Kumarasri](https://github.com/ShrishonK)
  - [Leonid Cherevko](https://github.com/leonid-cherevko)
