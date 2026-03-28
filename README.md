# 🎙️ EthioPodcast

**EthioPodcast** is a modern podcast streaming application designed specifically for Ethiopian content creators and listeners. Unlike traditional video platforms like YouTube, EthioPodcast provides an audio-first experience that allows users to listen to podcasts in audio-only format, enabling background playback when the app is minimized or the screen is off. Discover, stream, and enjoy a wide variety of Ethiopian podcasts covering topics from business and technology to culture, entertainment, and education - all while saving data and battery life.

## ✨ Features

### 🎧 Core Features
- **Stream Podcasts**: Listen to thousands of Ethiopian podcasts with a beautiful, intuitive audio player
- **Waveform Visualization**: Real-time audio waveform display for enhanced listening experience
- **Smart Search**: Search podcasts by title, author, category, or keywords
- **Category Browsing**: Explore podcasts organized by topics like Business, Technology, Education, Entertainment, and more
- **Personalized Home**: Dynamic home feed with trending podcasts, recent uploads, and personalized recommendations

### 👤 User Features
- **User Authentication**: Secure login and registration with Firebase Authentication
- **Profile Management**: Customize your profile with photo uploads, bio, and interests
- **Watchlist**: Save your favorite channels and podcasts for quick access
- **Listening History**: Track your listening activity and resume where you left off
- **Personalization**: Get podcast recommendations based on your interests and listening habits

### 🎨 User Experience
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Dark Theme**: Eye-friendly dark interface optimized for extended listening sessions
- **Lock Screen Controls**: Control playback from your device's lock screen
- **Background Playback**: Continue listening even when the screen is off
- **Offline Support**: Wake Lock API keeps your device awake during playback

### ⚙️ Settings & Privacy
- **Customizable Settings**: Adjust language, theme, autoplay, playback speed, and quality
- **Privacy Controls**: Manage profile visibility, history sharing, and recommendation preferences
- **Notification Preferences**: Control alerts for new podcasts, channel updates, and recommendations
- **Help & Support**: Built-in FAQ and support ticket system

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **React Router** - Client-side routing
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### Backend Integration
- **Firebase Authentication** - Secure user authentication
- **Supabase Storage** - Profile photo storage
- **REST API** - Backend API for podcast data and user management

### APIs & Services
- **YouTube IFrame API** - Audio streaming from YouTube
- **MediaSession API** - Lock screen controls
- **Wake Lock API** - Background playback support

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Firebase project (for authentication)
- Backend API server running

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ethiopodcast.git
cd ethiopodcast/ethiopodcast-landing
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. **Start the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5174`

## 🏗️ Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## 📱 Project Structure

```
ethiopodcast-landing/
├── src/
│   ├── api/              # API integration layer
│   │   ├── auth.js       # Authentication APIs
│   │   ├── podcasts.js   # Podcast APIs
│   │   ├── user.js       # User profile APIs
│   │   └── config.js     # API configuration
│   ├── components/       # Reusable components
│   │   ├── AudioPlayer.jsx
│   │   ├── Navbar.jsx
│   │   ├── PodcastCard.jsx
│   │   └── ...
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── Search.jsx
│   │   ├── Profile.jsx
│   │   ├── PodcastDetail.jsx
│   │   └── ...
│   ├── services/        # External services
│   │   └── firebase.js
│   ├── styles/          # CSS modules
│   └── App.jsx          # Main app component
├── public/              # Static assets
└── package.json
```

## 🎯 Key Pages

- **Landing** (`/`) - Marketing page with app features
- **Home** (`/home`) - Personalized podcast feed
- **Search** (`/search`) - Search and discover podcasts
- **Categories** (`/categories`) - Browse by category
- **Discover** (`/discover`) - Explore trending content
- **Podcast Detail** (`/podcast/:id`) - Individual podcast page with player
- **Profile** (`/profile`) - User profile and settings
- **Watchlist** (`/watchlist`) - Saved channels and podcasts
- **History** (`/history`) - Listening history

## 🔐 Authentication Flow

1. User visits landing page
2. Clicks "Get Started" or "Login"
3. Redirected to authentication page
4. After successful login, redirected to onboarding (first-time) or home
5. Protected routes require authentication

## 🎨 Design Philosophy

- **Mobile-First**: Designed for mobile devices, enhanced for desktop
- **Dark Theme**: Reduces eye strain during extended use
- **Purple Accent**: Brand color (#8b5cf6) used consistently throughout
- **Smooth Animations**: Subtle transitions for better UX
- **Touch-Friendly**: Minimum 44x44px touch targets

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 API Documentation

See the following files for backend API requirements:
- `BACKEND_REQUIREMENTS.md` - General backend setup
- `PERSONALIZATION_BACKEND.md` - User profile and settings APIs
- `NOTIFICATIONS_BACKEND.md` - Notification system APIs
- `SEARCH_BACKEND_REQUIREMENTS.md` - Search functionality APIs

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Ethiopian podcast creators and listeners
- Open source community
- Firebase and Supabase teams
- React and Vite communities

## 📧 Contact

For questions, suggestions, or support:
- Create an issue on GitHub
- Email: support@ethiopodcast.com (if available)

---

**Made with ❤️ for the Ethiopian podcast community**

🎙️ **EthioPodcast** - Listen. Discover. Connect.
