<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# TypeNotes

A vintage typewriter-style notes app built with React, TypeScript, and Tauri.

## Features

- 📝 Create and edit notes with a retro typewriter aesthetic
- 📅 Calendar view for filtering notes by date range
- 💾 Export notes as JSON
- ✨ AI-powered text polishing and continuation (optional, requires Gemini API key)
- 🖥️ Cross-platform desktop app (Windows, macOS, Linux)

## Tech Stack

- **Frontend**: React 19, TypeScript, TailwindCSS
- **Desktop**: Tauri 2.x
- **Build Tool**: Vite
- **Code Quality**: ESLint, Prettier

## Prerequisites

- Node.js (see `.nvmrc` for version)
- Rust (for Tauri) - [Install Rust](https://www.rust-lang.org/tools/install)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment (optional, for AI features):**
   Create a `.env.local` file and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Run in development mode:**
   ```bash
   # Web development
   npm run dev
   
   # Desktop development (Tauri)
   npm run tauri:dev
   ```

4. **Build for production:**
   ```bash
   # Web build
   npm run build
   
   # Desktop build (Tauri)
   npm run tauri:build
   ```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + Vite production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run tauri:dev` | Start Tauri in development mode |
| `npm run tauri:build` | Build Tauri application |

## Project Structure

```
├── src/                  # Frontend source code
│   ├── components/       # React components
│   ├── services/         # Business logic services
│   ├── types.ts          # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   └── index.tsx         # Entry point
├── src-tauri/            # Tauri (Rust) backend
│   ├── src/              # Rust source code
│   ├── icons/            # Application icons
│   └── tauri.conf.json   # Tauri configuration
├── eslint.config.js      # ESLint configuration
├── tailwind.config.js    # TailwindCSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## License

MIT
