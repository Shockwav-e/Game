# Pokemon Chess Game

A fully functional chess game with Pokemon-themed pieces built using HTML, CSS, and JavaScript.

## Features

### 🎮 Game Features

- **Complete Chess Rules**: All standard chess rules implemented including:
  - All piece movements (pawn, rook, knight, bishop, queen, king)
  - Pawn promotion to queen
  - Castling (both kingside and queenside)
  - Check and checkmate detection
  - Stalemate detection
  - Move validation (prevents illegal moves)

### 🎨 Pokemon Theme

- **White Team Pokemon**:

  - King: 🐉 (Dragonite)
  - Queen: 🌺 (Venusaur)
  - Rook: 🏔️ (Onix)
  - Bishop: ⚡ (Raichu)
  - Knight: 🔥 (Arcanine)
  - Pawn: 🌱 (Bulbasaur)

- **Black Team Pokemon**:
  - King: 🌙 (Umbreon)
  - Queen: 💎 (Gardevoir)
  - Rook: 🗿 (Golem)
  - Bishop: 🌊 (Vaporeon)
  - Knight: ⚔️ (Scyther)
  - Pawn: 🦇 (Zubat)

### 🎯 Game Interface

- **Visual Feedback**:
  - Selected pieces are highlighted in green
  - Valid moves are highlighted in yellow
  - Capture moves are highlighted in red
- **Game Status**: Shows current player and game state
- **Move History**: Displays all moves made during the game
- **Responsive Design**: Works on desktop and mobile devices

### 🎮 Controls

- **Click to Select**: Click on a piece to select it
- **Click to Move**: Click on a valid square to move the selected piece
- **New Game**: Start a fresh game
- **Reset**: Reset the current game

## How to Play

1. **Open the Game**: Open `index.html` in your web browser
2. **Select a Piece**: Click on any piece of your color (White goes first)
3. **Make a Move**: Click on a highlighted square to move your piece
4. **Follow Chess Rules**:
   - Pawns move forward one square (or two from starting position)
   - Rooks move horizontally and vertically
   - Knights move in L-shape
   - Bishops move diagonally
   - Queens move in any direction
   - Kings move one square in any direction
5. **Special Moves**:
   - **Castling**: Move king two squares toward rook, rook moves to other side
   - **Pawn Promotion**: Pawns become queens when reaching the opposite end
6. **Win Conditions**:
   - **Checkmate**: Opponent's king is in check with no legal moves
   - **Stalemate**: No legal moves but king is not in check

## Technical Details

### Files Structure

```
Game/
├── index.html      # Main HTML file
├── styles.css      # CSS styling
├── script.js       # JavaScript game logic
└── README.md       # This file
```

### Technologies Used

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling, animations, and responsive design
- **JavaScript (ES6+)**: Game logic, move validation, and interactivity

### Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Installation

1. Download all files to a folder
2. Open `index.html` in your web browser
3. Start playing!

## Game Rules Summary

### Basic Movement

- **Pawns**: Move forward one square, capture diagonally
- **Rooks**: Move any number of squares horizontally or vertically
- **Knights**: Move in L-shape (2 squares in one direction, 1 square perpendicular)
- **Bishops**: Move any number of squares diagonally
- **Queens**: Move any number of squares in any direction
- **Kings**: Move one square in any direction

### Special Rules

- **Check**: King is under attack
- **Checkmate**: King is in check with no escape
- **Castling**: Special king move with rook
- **En Passant**: Not implemented in this version
- **Pawn Promotion**: Pawns become queens when reaching the last rank

## Future Enhancements

Potential features for future versions:

- En passant capture
- Move timer
- AI opponent
- Save/load games
- Sound effects
- Animation effects
- Tournament mode

Enjoy playing Pokemon Chess! 🎮♟️
