# BuzzWhizz ⚡ — News. But make it Meme.

BuzzWhizz is India's first meme-news platform built for the fast-paced Gen Z generation. We turn boring news headlines into viral memes to make staying informed easy and entertaining. Built for speed, clarity, and zero boredom.

## 🚀 Features

- **Blazing Fast:** Powered by React + Vite for a smooth user experience.
- **Responsive & Mobile-First:** Beautifully optimized for mobile, tablet, and desktop viewports.
- **Infinite Scroll:** Never stop reading with seamless content loading.
- **Glassmorphism UI:** Modern, premium aesthetic with smooth animations and transitions.
- **Dark Mode:** Full dark mode support with system preference detection and persistence.
- **API Proxy:** Custom Express.js backend to securely handle NewsAPI requests and avoid CORS.
- **Bookmarks & Sharing:** Save your favorite stories and share them effortlessly.
- **Mock Data Fallback:** Always remains functional even if the API is rate-limited.

## 🛠️ Technology Stack

- **Frontend:** React.js, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js
- **State Management:** React Context API
- **Icons & Fonts:** Custom SVGs, Google Fonts (Inter)

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- NewsAPI Key (Get one for free at [newsapi.org](https://newsapi.org))

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd BizzWhizz
   ```

2. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   cp .env.example .env
   # Add your NEWS_API_KEY to the .env file
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd ../Frontend
   npm install
   cp .env.example .env
   # The default VITE_API_URL should work for local development
   npm run dev
   ```

## 🌐 Deployment

- **Frontend:** Deploy to Vercel or Netlify. Ensure `VITE_API_URL` points to your deployed backend.
- **Backend:** Deploy to Render, Railway, or Heroku. Add `NEWS_API_KEY` to your production environment variables.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with ⚡ for the future of news.
