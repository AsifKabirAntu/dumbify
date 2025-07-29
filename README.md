# 🚀 Dumbify

**Dumbify** is a beautiful web app that explains code in simplified, funny, or casual ways using AI. Whether you want a baby-friendly explanation or a sarcastic roast of your code, Dumbify has got you covered!

## ✨ Features

- **🌙 Dark Mode by Default** - Beautiful dark theme that's easy on the eyes
- **🔐 User Authentication** - Secure signup/login with Supabase
- **📝 Code Input** - Paste any code (JavaScript, Python, etc.) in the elegant editor
- **🎭 Multiple Explanation Tones**:
  - 🧒 **Baby Mode**: Explanations like you're 5 years old
  - 💀 **Sarcastic Mode**: Witty and humorous explanations  
  - 💅 **Influencer Mode**: Gen-Z vibes and trendy explanations
  - 👨‍🏫 **Professor Mode**: Academic but accessible explanations
- **📊 Smart Explanations**: Quick overview + detailed line-by-line breakdown
- **📚 History Management**: Auto-saves explanations with timestamps
- **🎨 Linear-Style UI**: Clean, minimal design inspired by Linear
- **⚡ AI-Powered**: Uses OpenRouter's GPT-4 API for intelligent explanations
- **📱 Responsive Design**: Works beautifully on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: TailwindCSS with custom Linear-inspired design
- **Backend**: Next.js API Routes
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenRouter (GPT-4)
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- An OpenRouter API key ([Get one here](https://openrouter.ai/keys))
- A Supabase project ([Create one here](https://supabase.com/dashboard))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dumbify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your keys:
   ```env
   # OpenAI API Key for OpenRouter
   OPENAI_API_KEY=your_openrouter_api_key_here
   
   # Supabase Configuration  
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Authentication**
   
   In your Supabase dashboard:
   - Go to Authentication → Settings
   - Enable Email authentication
   - Configure your site URL to `http://localhost:3000` for development
   - Optionally enable other providers (Google, GitHub, etc.)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) to see the app!

## 🔧 Usage

### Without Authentication (Guest Mode)
1. **Paste your code** in the elegant code editor
2. **Choose an explanation style** from the four available tones
3. **Click "Explain Code"** to get your AI-generated explanation
4. **Enjoy** both the quick overview and detailed line-by-line breakdown!

### With Authentication
1. **Sign up/Login** using the sidebar authentication
2. **Your explanations are automatically saved** to your personal history
3. **Browse your history** in the sidebar
4. **Click any history item** to reload it in the lab
5. **Manage your explanations** with delete and download options

## 🎯 Example

**Input Code:**
```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

**Baby Mode Output:**
```
🎯 Quick Summary
This is like a magic number machine that makes Fibonacci numbers! It's like counting bunny families! 🐰

🔍 Line by Line  
• `function fibonacci(n)` - We're making a special counting machine
• `if (n <= 1) return n` - If we want 0 or 1 bunnies, just give that number!
• `return fibonacci(n-1) + fibonacci(n-2)` - For bigger numbers, add the last two family sizes together!
```

**Sarcastic Mode Output:**
```
🎯 The Gist
Oh look, another recursive Fibonacci. How original! This calls itself more times than your ex trying to get back together.

🔍 Line by Line Roast
• Line 1: Declaring a function, groundbreaking stuff
• Line 2: Base case handling - at least someone thought about infinite loops
• Line 3: The classic "let me call myself" approach. Stack overflow says hi! 👋
```

## 📁 Project Structure

```
dumbify/
├── app/
│   ├── api/
│   │   └── dumbify/
│   │       └── route.ts          # AI explanation API endpoint
│   ├── components/
│   │   ├── AuthModal.tsx         # Beautiful login/signup modal
│   │   ├── DumbifyLab.tsx        # Main code explanation interface
│   │   ├── ExplanationDisplay.tsx # Enhanced explanation UI
│   │   └── Sidebar.tsx           # Navigation with auth controls
│   ├── contexts/
│   │   ├── AuthContext.tsx       # Supabase authentication
│   │   ├── HistoryContext.tsx    # Explanation history management
│   │   └── ThemeContext.tsx      # Dark/light theme (defaults to dark)
│   ├── globals.css               # Global styles with Linear design
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Main application page
├── lib/
│   └── supabase.ts              # Supabase client configuration
├── .env.local.example           # Environment variables template
├── README.md                    # This file
├── package.json                 # Dependencies
├── tailwind.config.js           # TailwindCSS config
└── tsconfig.json               # TypeScript config
```

## 🌟 Key Features

### 🎨 Beautiful UI/UX
- **Linear-inspired design** with clean lines and subtle shadows
- **Smooth animations** and micro-interactions
- **Responsive sidebar** that collapses on smaller screens
- **Dark mode by default** with optional light mode toggle

### 🔐 Authentication
- **Secure Supabase authentication** with email/password
- **User profiles** with name and avatar support
- **Protected history** - only your explanations
- **Seamless login/signup** with beautiful modal

### 📊 Smart Explanations
- **Concise responses** under 150 words
- **Structured format** with overview + line-by-line
- **Tone-specific styling** with unique gradients
- **Interactive controls** to show/hide sections

### 📚 History Management
- **Auto-save** every explanation
- **Persistent storage** across sessions
- **Quick preview** with code snippets and timestamps
- **One-click restoration** to lab

## 🌟 Contributing

Feel free to contribute to this project! Here are some ideas:

- Add more explanation tones (Poet Mode, Pirate Mode, etc.)
- Syntax highlighting for code input
- Export explanations to different formats
- Social sharing features
- Code complexity analysis
- Multi-language support

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **OpenRouter** for providing access to GPT-4
- **Supabase** for seamless authentication and database
- **Next.js** team for the amazing framework  
- **TailwindCSS** for beautiful styling
- **Linear** for design inspiration
- **Lucide React** for the perfect icons

---

**Made with ❤️ for developers who want to understand code better!**

*Now with dark mode by default and secure authentication! 🚀* 