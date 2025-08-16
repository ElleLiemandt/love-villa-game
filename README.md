# 🏝️ Love Island USA: Villa Parody Game 🏝️

A choose-your-own-adventure parody game inspired by Love Island USA Seasons 6 & 7, featuring real cast members and interactive storytelling.

## 🎮 Features

- **Interactive Story**: Single-speaker dialogue system with Episode-style avatars
- **Dynamic Avatar System**: Auto-discovery of character avatars with fallback support
- **Love & Drama Meters**: Hidden scoring system with floating bubble UI
- **Math Challenges**: Earn Love points through timed math problems
- **Choice System**: Locked "good" choices requiring Love points and math challenges
- **Character Cast**: Real islanders from Seasons 6 & 7, hosted by Ariana Madix
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/[your-username]/love-villa-game.git
   cd love-villa-game
   ```

2. **Run the server**:
   ```bash
   python3 run.py
   ```

3. **Open your browser** to `http://localhost:8001` (or the port shown in terminal)

4. **Start playing!** Click "🏝️ Enter the Villa" to begin

## 🎯 How to Play

- **Intro Sequence**: Meet Ariana and all the islanders
- **Story Progression**: Press `Space` or `Enter` to advance dialogue
- **Choices**: Select responses that affect your Love and Drama meters
- **Math Challenges**: Solve problems to unlock premium choices
- **Multiple Endings**: Your choices determine your villa fate!

## 🔧 Dev Tools

- **Avatar Validation**: Press `A` key or click "Dev: Avatar Validation" 
- **Math Test**: Press `M` key to test the math challenge system
- **Console Logs**: Detailed logging for development and debugging

## 📁 Project Structure

```
love-villa-game/
├── index.html          # Main game interface
├── game.js             # Core game logic & story engine
├── run.py              # Local development server
├── memory.md           # Implementation documentation
├── public/             # Static assets
│   └── assets/
│       ├── avatars/    # Character avatar images
│       └── backgrounds/ # Scene background images
└── README.md           # This file
```

## 🎨 Character System

The game features a dynamic avatar discovery system that automatically maps character IDs to avatar files:

- **Auto-Discovery**: Scans `public/assets/avatars/` for available images
- **Smart Matching**: Handles different filename cases (nic.png, Nic.png, etc.)
- **Fallback System**: Uses placeholder for missing avatars
- **Multi-Format**: Supports .png, .webp, and .jpg files

## 💖 Game Mechanics

- **Love Points**: Earn through math challenges, spend on premium choices
- **Drama Points**: Accumulate through risky decisions, leads to elimination at 9+
- **Choice Types**: 
  - Bad choices (immediate consequences)
  - Good choices (require Love points + math challenge)
- **Elimination**: Get dumped if Drama gets too high!

## 🛠️ Technical Features

- **Vanilla JavaScript**: No frameworks, pure JS implementation
- **CSS Bubble UI**: Floating Love/Drama meters with animations
- **Single-Speaker System**: Episode-style dialogue with circular avatars
- **Local Storage**: Persistent game state and progress saving
- **Responsive Design**: Optimized for both desktop and mobile

## 🎭 Cast

Featuring islanders from Love Island USA Seasons 6 & 7:
- **Host**: Ariana Madix
- **Season 6**: Leah, Serena, JaNa, Nic, Rob, Miguel, and more
- **Season 7**: Amaya, Huda, Olandria, Bryan, Kenny, and others

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

This is a parody project for entertainment purposes. Feel free to fork and create your own villa adventures!

## 📄 License

This project is for educational and entertainment purposes. Love Island is a trademark of ITV Studios.

---

Made with 💕 and ☀️ for villa fans everywhere!
