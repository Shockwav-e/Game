// Pokémon Chess - script.js (vanilla JS)
// Drop this file next to index.html and styles.css

class PokemonChess {
  constructor() {
    this.board = [];
    this.currentPlayer = "white";
    this.selectedPiece = null;
    this.validMoves = [];
    this.moveHistory = [];
    this.gameOver = false;
    this.inCheck = false;
    this.checkmate = false;

    // Map piece types to image paths (place matching files in images/)
    this.pokemonPieces = {
      white: {
        king: "images/dragonite.png",
        queen: "images/venusaur.png",
        rook: "images/onix.png",
        bishop: "images/raichu.png",
        knight: "images/arcanine.png",
        pawn: "images/bulbasaur.png",
      },
      black: {
        king: "images/umbreon.png",
        queen: "images/gardevoir.png",
        rook: "images/golem.png",
        bishop: "images/vaporeon.png",
        knight: "images/scyther.png",
        pawn: "images/zubat.png",
      },
    };

    // Initialize the board right away
    this.initializeBoard();
    this.setupEventListeners();
    this.updateDisplay();

    // Preload images after initialization
    this.preloadImages();
  }

  // Preload sprites to reduce flicker
  preloadImages() {
    const preloadDiv = document.getElementById("preload");
    const urls = new Set();
    Object.values(this.pokemonPieces).forEach((side) =>
      Object.values(side).forEach((url) => urls.add(url))
    );
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
      preloadDiv.appendChild(img);
    });
  }

  initializeBoard() {
    this.board = [];
    for (let row = 0; row < 8; row++) {
      this.board[row] = [];
      for (let col = 0; col < 8; col++) {
        this.board[row][col] = null;
      }
    }

    // Set up initial piece positions
    this.setupPieces();
    this.createBoardHTML();
  }

  setupPieces() {
    // pawns
    for (let col = 0; col < 8; col++) {
      this.board[1][col] = { type: "pawn", color: "black", hasMoved: false };
      this.board[6][col] = { type: "pawn", color: "white", hasMoved: false };
    }

    // other pieces order (keeps consistent mapping)
    const pieceOrder = [
      "rook",
      "knight",
      "bishop",
      "queen",
      "king",
      "bishop",
      "knight",
      "rook",
    ];

    for (let col = 0; col < 8; col++) {
      this.board[0][col] = {
        type: pieceOrder[col],
        color: "black",
        hasMoved: false,
      };
      this.board[7][col] = {
        type: pieceOrder[col],
        color: "white",
        hasMoved: false,
      };
    }
  }

  createBoardHTML() {
    const boardElement = document.getElementById("chess-board");
    boardElement.innerHTML = "";

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement("div");
        square.className = `square ${
          (row + col) % 2 === 0 ? "white" : "black"
        }`;
        square.dataset.row = row;
        square.dataset.col = col;
        square.setAttribute("role", "gridcell");

        const piece = this.board[row][col];
        if (piece) {
          const pieceElement = document.createElement("img");
          pieceElement.className = `piece ${piece.color} ${piece.type}`;
          pieceElement.src = this.pokemonPieces[piece.color][piece.type];
          pieceElement.alt = `${piece.color} ${piece.type}`;
          pieceElement.draggable = false;
          square.appendChild(pieceElement);
        }

        boardElement.appendChild(square);
      }
    }
  }

  setupEventListeners() {
    const board = document.getElementById("chess-board");
    board.addEventListener("click", (e) => {
      if (this.gameOver) return;

      const square = e.target.closest(".square");
      if (!square) return;

      const row = parseInt(square.dataset.row);
      const col = parseInt(square.dataset.col);

      this.handleSquareClick(row, col);
    });

    // Add touch handling
    board.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault(); // Prevent scrolling
        if (this.gameOver) return;

        const touch = e.touches[0];
        const square = document
          .elementFromPoint(touch.clientX, touch.clientY)
          .closest(".square");
        if (!square) return;

        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        this.handleSquareClick(row, col);
      },
      { passive: false }
    );

    // Buttons (two sets for different places)
    document
      .getElementById("new-game-btn")
      .addEventListener("click", () => this.newGame());
    document
      .getElementById("reset-btn")
      .addEventListener("click", () => this.resetGame());
    document
      .getElementById("new-game-btn-2")
      .addEventListener("click", () => this.newGame());
    document
      .getElementById("reset-btn-2")
      .addEventListener("click", () => this.resetGame());
  }

  // Add this method to PokemonChess class
  isValidMove(row, col) {
    if (!this.selectedPiece) return false;

    return this.validMoves.some((move) => move.row === row && move.col === col);
  }

  handleSquareClick(row, col) {
    const piece = this.board[row][col];

    // If game is over, do nothing
    if (this.gameOver) return;

    // If no piece is selected and clicked on own piece
    if (!this.selectedPiece && piece && piece.color === this.currentPlayer) {
      this.selectPiece(row, col);
    }
    // If piece is selected and clicked on valid move
    else if (this.selectedPiece && this.isValidMove(row, col)) {
      this.makeMove(row, col);
    }
    // If piece is selected and clicked on own piece again
    else if (piece && piece.color === this.currentPlayer) {
      this.selectPiece(row, col);
    }
    // Otherwise clear selection
    else {
      this.clearSelection();
    }
  }

  selectPiece(row, col) {
    this.selectedPiece = { row, col };
    this.validMoves = this.getValidMoves(row, col);
    this.updateBoardDisplay();
  }

  clearSelection() {
    this.selectedPiece = null;
    this.validMoves = [];
    this.updateBoardDisplay();
  }

  makeMove(toRow, toCol) {
    const fromRow = this.selectedPiece.row;
    const fromCol = this.selectedPiece.col;
    const piece = this.board[fromRow][fromCol];

    // Promotion for pawn
    if (piece.type === "pawn" && (toRow === 0 || toRow === 7)) {
      piece.type = "queen";
    }

    // Record hasMoved
    piece.hasMoved = true;

    // Castling
    if (piece.type === "king" && Math.abs(fromCol - toCol) === 2) {
      this.handleCastling(toRow, toCol);
    }

    // If capture animate old piece (optional)
    const captured = this.board[toRow][toCol];
    if (captured) {
      const targetSquare = document.querySelector(
        `[data-row="${toRow}"][data-col="${toCol}"]`
      );
      const img = targetSquare.querySelector("img.piece");
      if (img) {
        img.classList.add("capture-animate");
        setTimeout(() => {
          // removal handled below by re-render
        }, 220);
      }
    }

    // Move
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;

    // Record move
    this.recordMove(fromRow, fromCol, toRow, toCol);

    // Switch player
    this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";

    // Re-check game
    this.checkGameState();

    this.clearSelection();
    this.updateDisplay();
  }

  handleCastling(toRow, toCol) {
    const isKingside = toCol > 4;
    const rookCol = isKingside ? 7 : 0;
    const newRookCol = isKingside ? 5 : 3;
    this.board[toRow][newRookCol] = this.board[toRow][rookCol];
    this.board[toRow][rookCol] = null;
  }

  getValidMoves(row, col) {
    const piece = this.board[row][col];
    if (!piece) return [];
    let moves = [];
    switch (piece.type) {
      case "pawn":
        moves = this.getPawnMoves(row, col);
        break;
      case "rook":
        moves = this.getRookMoves(row, col);
        break;
      case "knight":
        moves = this.getKnightMoves(row, col);
        break;
      case "bishop":
        moves = this.getBishopMoves(row, col);
        break;
      case "queen":
        moves = this.getQueenMoves(row, col);
        break;
      case "king":
        moves = this.getKingMoves(row, col);
        break;
      default:
        moves = [];
    }

    // filter out moves that put your king in check
    return moves.filter(
      (m) => !this.wouldPutKingInCheck(row, col, m.row, m.col)
    );
  }

  getPawnMoves(row, col) {
    const moves = [];
    const color = this.board[row][col].color;
    const direction = color === "white" ? -1 : 1;
    const startRow = color === "white" ? 6 : 1;

    // forward one
    if (
      this.isValidPosition(row + direction, col) &&
      !this.board[row + direction][col]
    ) {
      moves.push({ row: row + direction, col });
      // double
      if (row === startRow && !this.board[row + 2 * direction][col]) {
        moves.push({ row: row + 2 * direction, col });
      }
    }

    // captures
    for (const c of [-1, 1]) {
      const nr = row + direction,
        nc = col + c;
      if (
        this.isValidPosition(nr, nc) &&
        this.board[nr][nc] &&
        this.board[nr][nc].color !== color
      ) {
        moves.push({ row: nr, col: nc });
      }
    }
    return moves;
  }

  getRookMoves(row, col) {
    return this.getLinearMoves(row, col, [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]);
  }
  getBishopMoves(row, col) {
    return this.getLinearMoves(row, col, [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]);
  }
  getQueenMoves(row, col) {
    return [...this.getRookMoves(row, col), ...this.getBishopMoves(row, col)];
  }

  getKnightMoves(row, col) {
    const moves = [];
    const offsets = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];
    for (const [dr, dc] of offsets) {
      const nr = row + dr,
        nc = col + dc;
      if (
        this.isValidPosition(nr, nc) &&
        (!this.board[nr][nc] ||
          this.board[nr][nc].color !== this.board[row][col].color)
      ) {
        moves.push({ row: nr, col: nc });
      }
    }
    return moves;
  }

  getKingMoves(row, col) {
    const moves = [];
    const offsets = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    for (const [dr, dc] of offsets) {
      const nr = row + dr,
        nc = col + dc;
      if (
        this.isValidPosition(nr, nc) &&
        (!this.board[nr][nc] ||
          this.board[nr][nc].color !== this.board[row][col].color)
      ) {
        moves.push({ row: nr, col: nc });
      }
    }
    moves.push(...this.getCastlingMoves(row, col));
    return moves;
  }

  getCastlingMoves(row, col) {
    const moves = [];
    const piece = this.board[row][col];
    if (piece.hasMoved) return moves;
    if (this.canCastle(row, col, true)) moves.push({ row, col: col + 2 });
    if (this.canCastle(row, col, false)) moves.push({ row, col: col - 2 });
    return moves;
  }

  canCastle(row, col, kingside) {
    const rookCol = kingside ? 7 : 0;
    const rook = this.board[row][rookCol];
    const king = this.board[row][col];
    if (
      !rook ||
      rook.type !== "rook" ||
      rook.hasMoved ||
      rook.color !== king.color
    )
      return false;
    const startCol = kingside ? col + 1 : col - 1;
    const endCol = kingside ? 6 : 2;
    for (
      let c = startCol;
      kingside ? c <= endCol : c >= endCol;
      c += kingside ? 1 : -1
    ) {
      if (this.board[row][c] || this.isSquareUnderAttack(row, c)) return false;
    }
    return true;
  }

  getLinearMoves(row, col, directions) {
    const moves = [];
    for (const [rdir, cdir] of directions) {
      let nr = row + rdir,
        nc = col + cdir;
      while (this.isValidPosition(nr, nc)) {
        if (!this.board[nr][nc]) moves.push({ row: nr, col: nc });
        else {
          if (this.board[nr][nc].color !== this.board[row][col].color)
            moves.push({ row: nr, col: nc });
          break;
        }
        nr += rdir;
        nc += cdir;
      }
    }
    return moves;
  }

  isValidPosition(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  isSquareUnderAttack(row, col) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = this.board[r][c];
        if (p && p.color !== this.currentPlayer) {
          const moves = this.getRawMoves(r, c);
          if (moves.some((m) => m.row === row && m.col === col)) return true;
        }
      }
    }
    return false;
  }

  getRawMoves(row, col) {
    const piece = this.board[row][col];
    if (!piece) return [];
    switch (piece.type) {
      case "pawn":
        return this.getPawnMoves(row, col);
      case "rook":
        return this.getRookMoves(row, col);
      case "knight":
        return this.getKnightMoves(row, col);
      case "bishop":
        return this.getBishopMoves(row, col);
      case "queen":
        return this.getQueenMoves(row, col);
      case "king":
        return this.getKingMoves(row, col);
      default:
        return [];
    }
  }

  wouldPutKingInCheck(fromRow, fromCol, toRow, toCol) {
    const temp = this.board[toRow][toCol];
    this.board[toRow][toCol] = this.board[fromRow][fromCol];
    this.board[fromRow][fromCol] = null;

    const kingPos = this.findKing(this.currentPlayer);
    const inCheck = this.isSquareUnderAttack(kingPos.row, kingPos.col);

    this.board[fromRow][fromCol] = this.board[toRow][toCol];
    this.board[toRow][toCol] = temp;
    return inCheck;
  }

  findKing(color) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = this.board[r][c];
        if (p && p.type === "king" && p.color === color)
          return { row: r, col: c };
      }
    }
    return null;
  }

  showGameOverScreen(winner) {
    const overlay = document.querySelector(".game-over-overlay");
    const winnerText = overlay.querySelector(".winner-text");

    // Set winner text
    if (this.checkmate) {
      winnerText.textContent = `${winner} wins by checkmate!`;
    } else {
      winnerText.textContent = "It's a draw by stalemate!";
    }

    // Show overlay with animation
    requestAnimationFrame(() => {
      overlay.classList.add("visible");
    });

    // Setup play again button
    const playAgainBtn = overlay.querySelector(".play-again");
    playAgainBtn.onclick = () => {
      overlay.classList.remove("visible");
      this.newGame();
    };
  }

  checkGameState() {
    const kingPosition = this.findKing(this.currentPlayer);
    if (!kingPosition) {
      this.gameOver = true;
      const winner = this.currentPlayer === "white" ? "Black" : "White";
      this.showGameOverScreen(winner);
      return;
    }

    this.inCheck = this.isSquareUnderAttack(kingPosition.row, kingPosition.col);

    if (this.inCheck) {
      if (!this.hasValidMoves()) {
        this.checkmate = true;
        this.gameOver = true;
        const winner = this.currentPlayer === "white" ? "Black" : "White";
        this.showGameOverScreen(winner);
      }
    } else if (!this.hasValidMoves()) {
      this.gameOver = true;
      this.showGameOverScreen("Nobody"); // Stalemate
    }
  }

  hasValidMoves() {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = this.board[r][c];
        if (p && p.color === this.currentPlayer) {
          if (this.getValidMoves(r, c).length > 0) return true;
        }
      }
    }
    return false;
  }

  recordMove(fromRow, fromCol, toRow, toCol) {
    const moved = this.board[toRow][toCol];
    const move = {
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
      piece: moved.type,
      color: moved.color,
      captured: null,
      moveNumber: Math.floor(this.moveHistory.length / 2) + 1,
    };

    // determine captured (we overwrote earlier so inspect history)
    // For simplicity: if earlier capture existed, we won't duplicate - but we can check moveHistory last state
    // Instead, infer if the destination previously had a piece by looking at last saved board? Simpler: use a quick check:
    // We can check if there was a piece captured by analyzing moveList DOM before creating the new board (we have no snapshot) - so set captured to null for now.
    // If you need exact capture names in history, we can improve persistence; current implementation fills basic info.
    // We'll attempt to infer captured by looking at previous board in memory (we already have it because we moved pieces in makeMove after capturing).
    // So use a temporary method: look at last move (we recorded before actual re-render), but for safety leave it null or you can improve later.

    // Quick attempt: since makeMove already replaced board, we don't have previous piece - so skip captured detection for now.
    this.moveHistory.push(move);
  }

  updateBoardDisplay() {
    // remove highlight classes first
    document.querySelectorAll(".square").forEach((s) => {
      s.classList.remove("selected", "valid-move", "capture");
    });

    if (this.selectedPiece) {
      const sel = document.querySelector(
        `[data-row="${this.selectedPiece.row}"][data-col="${this.selectedPiece.col}"]`
      );
      if (sel) sel.classList.add("selected");

      this.validMoves.forEach((move) => {
        const target = document.querySelector(
          `[data-row="${move.row}"][data-col="${move.col}"]`
        );
        if (!target) return;
        const targetPiece = this.board[move.row][move.col];
        if (targetPiece) target.classList.add("capture");
        else target.classList.add("valid-move");
      });
    }
  }

  updateDisplay() {
    document.getElementById("current-player").textContent =
      this.currentPlayer === "white" ? "White" : "Black";

    let status = "Game in progress";
    if (this.checkmate) {
      status = `Checkmate! ${
        this.currentPlayer === "white" ? "Black" : "White"
      } wins!`;
    } else if (this.gameOver) {
      status = "Stalemate — draw.";
    } else if (this.inCheck) {
      status = "Check!";
    }
    document.getElementById("game-status").textContent = status;

    this.updateMoveHistory();

    // re-create board and update highlights
    this.createBoardHTML();
    // small delay to allow DOM image insertion before applying highlight classes
    requestAnimationFrame(() => this.updateBoardDisplay());
  }

  updateMoveHistory() {
    const moveList = document.getElementById("move-list");
    moveList.innerHTML = "";
    for (let i = 0; i < this.moveHistory.length; i += 2) {
      const move1 = this.moveHistory[i];
      const move2 = this.moveHistory[i + 1];

      const container = document.createElement("div");
      container.className = "move-entry";

      const left = document.createElement("div");
      left.textContent = `${move1.moveNumber}. ${this.prettyName(
        move1.piece
      )} ${String.fromCharCode(97 + move1.from.col)}${
        8 - move1.from.row
      } → ${String.fromCharCode(97 + move1.to.col)}${8 - move1.to.row}`;

      const right = document.createElement("div");
      right.style.opacity = "0.7";
      if (move2) {
        right.textContent = `${this.prettyName(
          move2.piece
        )} ${String.fromCharCode(97 + move2.from.col)}${
          8 - move2.from.row
        } → ${String.fromCharCode(97 + move2.to.col)}${8 - move2.to.row}`;
      } else {
        right.textContent = "";
      }

      container.appendChild(left);
      container.appendChild(right);
      moveList.appendChild(container);
    }
    moveList.scrollTop = moveList.scrollHeight;
  }

  prettyName(type) {
    const map = {
      king: "K",
      queen: "Q",
      rook: "R",
      bishop: "B",
      knight: "N",
      pawn: "P",
    };
    return map[type] || type;
  }

  newGame() {
    this.currentPlayer = "white";
    this.selectedPiece = null;
    this.validMoves = [];
    this.moveHistory = [];
    this.gameOver = false;
    this.inCheck = false;
    this.checkmate = false;
    this.initializeBoard();
    this.updateDisplay();
  }

  resetGame() {
    this.newGame();
  }
}

// initialize
document.addEventListener("DOMContentLoaded", () => {
  window.pokemonChess = new PokemonChess();
});
