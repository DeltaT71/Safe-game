# Safe Cracking Game

A small interactive safe-cracking game built with Pixi.js and GSAP, where users must rotate a handle in the correct sequence to open a door and reveal sparkles!

## Features

    Smooth handle rotation animation with direction detection.

    Procedurally generated safe combinations.

    Visual feedback for both success and failure.

    Clean, responsive canvas scaling to fit any screen.

    Gold sparkle animation on success using GSAP.

    Fully commented, readable codebase.

## Tech Stack

    Pixi.js – rendering engine

    GSAP – animations

    TypeScript – code structure

    Vite (optional, if used for dev server/build)

    Pixi Devtools – runtime debugging

## Installation

```bash
git clone https://github.com/your-username/safe-cracking-game.git
cd safe-cracking-game
npm install
npm run dev
```

Make sure you have **Node.js** installed.

## How to Play

Click the left or right side of the door to rotate the handle.
Follow the randomly generated rotation pattern (shown in the console for dev).
If you succeed — the door opens with sparkles!
If you fail — the handle spins wildly and resets.

## Project Structure

```bash
/src
  ├─ /rendering     # rendering functions for sprites
  ├─ /assets        # door, handle, sparkle graphics
  ├─ main.ts        # core game logic
  ├─ config.ts      # screen settings
```

## License

MIT – free to use, modify, and learn from.
