/* eslint-disable prettier/prettier */
import {
  Application,
  Container,
  ContainerChild,
  Renderer,
  Sprite,
  Text,
} from "pixi.js";

// Type to hold the data is used to print a wim with PIXI.Text
type WinInfo = {
  paylineNumber: number;
  symbol: string;
  symbolCount: number;
  points: number;
};

// Symbols on the slot machine
type Symbols = 'bar' | 'leaf' | 'seven' | 'bell' | 'orange' | 'apple' | 'lemon' | 'cherries';

// Object to hold payout table values
const payoutTable: Record<Symbols, Record<number, number>> = {
  bar: { 3: 10, 4: 20, 5: 50 },
  leaf: { 3: 5,  4: 10, 5: 20 },
  seven: { 3: 5,  4: 10, 5: 15 },
  bell: { 3: 5,  4: 10, 5: 15 },
  orange: { 3: 2,  4: 5,  5: 10 },
  apple: { 3: 1,  4: 2,  5: 5  },
  lemon: { 3: 1,  4: 2,  5: 3  },
  cherries: { 3: 1,  4: 2,  5: 3  },
}

// The grid width will take 40 percent of the screen width
const GRID_WIDTH_RATIO = 0.4;

// The grid height will take 50 percent of the screen height
const GRID_HEIGHT_RATIO = 0.5;

// Number of rows on the grid
const ROWS = 3;

// Number of columns on the grid
const COLUMNS = 5;

// Number of symbols of a reel band
const BAND_LENGTH = 20;

// Number of pixels that separates each element of the canvas vertically
const VERTICAL_OFFSET = 25;

// Number of pixels that separates each symbol on the grid
const SYMBOL_OFFSET = 10;

export function slotMachine(app: Application<Renderer>) {
  // Reels positions
  const positions: number[] = [0, 0, 0, 0, 0];

  // Reel set
  const reelSet: Symbols[][] = [
      ["leaf", "lemon", "lemon", "bar", "bar", "orange", "bar", "bell", "orange", "seven", "leaf", "seven", "cherries", "bell", "orange", "leaf", "cherries", "orange", "lemon", "leaf"],
      ["bar", "apple", "lemon", "apple", "orange", "orange", "cherries", "orange", "orange", "bell", "lemon", "leaf", "orange", "lemon", "bar", "orange", "apple", "cherries", "lemon", "apple"],
      ["orange", "leaf", "lemon", "cherries", "seven", "leaf", "apple", "leaf", "leaf", "orange", "seven", "orange", "bar", "apple", "seven", "leaf", "bell", "bar", "apple", "cherries"],
      ["leaf", "apple", "seven", "apple", "cherries", "cherries", "seven", "apple", "cherries", "bar", "orange", "bar", "apple", "seven", "apple", "lemon", "leaf", "orange", "seven", "apple"],
      ["lemon", "cherries", "leaf", "seven", "bell", "bar", "seven", "leaf", "leaf", "bell", "bell", "leaf", "apple", "bell", "bar", "apple", "bar", "apple", "bell", "cherries"]
  ];

  // Array representation of the 5x3 grid
  const grid: Symbols[] = [];

  // Container to hold the slot symbols grid
  const symbolContainer = new Container();
  app.stage.addChild(symbolContainer);

  // Spin button texture
  const spinButton = Sprite.from("button");
  app.stage.addChild(spinButton);

  // Multiline wins text
  const winningText = new Text({
    text: "",
    style: {
      fontFamily: "Arial",
    },
  });
  app.stage.addChild(winningText);

  const gridWidth = app.screen.width * GRID_WIDTH_RATIO;
  const gridHeight = app.screen.height * GRID_HEIGHT_RATIO;

  const cellWidth = gridWidth / COLUMNS;
  const cellHeight = gridHeight / ROWS;

  function play() {
    for (let i = 0; i < ROWS * COLUMNS; i++) {
      // Coordinated of cells in the 5x3 grid
      const x = (i % 5) * (cellWidth + SYMBOL_OFFSET);
      const y = Math.floor(i / 5) * (cellHeight + SYMBOL_OFFSET);

      // Add elements into the grid row by row
      // First, find the reel position from the position array based on i, and then add one or two depending on the row
      // For example, the first row we add 0 to all the reels positions, the seconds row, we add 1 to all the reels positions
      const reelPosition = positions[i % 5] + Math.floor(i / 5);

      // Second find the symbol corresponding to the reel position from the reel set
      // Make sure to account for cases where the position is bigger than the band length and start from the beginning
      const currentSymbol = reelSet[i % 5][reelPosition % 20];

      //Add Symbol to grid array
      grid[i] = currentSymbol;

      const symbol = Sprite.from(currentSymbol);

      // Position and scale symbol
      symbol.position.set(x, y);
      symbol.setSize(cellWidth, cellHeight);

      symbolContainer.addChild(symbol);
    }

    // Find winning combinations if there are any
    const wins: WinInfo[] = checkWinningCombination(grid);

    // Display the multiline wins text
    let totalWins = 0;
    wins.forEach((win) => {
      totalWins += win.points;
    });
    winningText.text += `Total Wins: ${totalWins}\n`;

    if (wins.length > 0) {
      wins.forEach((win) => {
        const line = `- payline ${win.paylineNumber}, ${win.symbol} x${win.symbolCount}, ${win.points}\n`;
        winningText.text += line;
      });
    }
  }

  // Set spin button interactivity
  spinButton.eventMode = "static";
  spinButton.cursor = "pointer";
  spinButton.addListener("pointerdown", () => {
    for (let i = 0; i < positions.length; i++) {
      positions[i] = Math.floor(Math.random() * BAND_LENGTH);
    }
    symbolContainer.removeChildren(); // Clear grid
    winningText.text = ""; // Clear text
    play();
  });

  // At the start, display the game area, and check for any wins
  // There should only be one payline win is the starting positions are all zeros
  play();

  return { symbolContainer, spinButton, winningText };
}

export function scaleAndPosition(app: Application<Renderer>,
                                 symbolContainer: Container<ContainerChild>,
                                 playButton: Sprite,
                                 winText: Text) {
  const gridWidth = app.screen.width * GRID_WIDTH_RATIO;
  const gridHeight = app.screen.height * GRID_HEIGHT_RATIO;

  const cellWidth = gridWidth / COLUMNS;

  // Reposition and resize the grid on top middle of the screen with a little margin
  symbolContainer.position.x = (app.screen.width - gridWidth) / 2;
  symbolContainer.position.y = VERTICAL_OFFSET;
  symbolContainer.setSize(gridWidth, gridHeight);

  // Reposition and resize the spin button to be bellow the grid
  playButton.setSize(cellWidth);
  playButton.anchor.set(0.5, 0);
  playButton.position.x = app.screen.width / 2;
  playButton.position.y = gridHeight + (VERTICAL_OFFSET * 2);

  // Reposition and resize the text the be bellow the spin button
  winText.style.fontSize = cellWidth / 4.5;
  winText.anchor.set(0.5, 0);
  winText.position.x = app.screen.width / 2;
  winText.position.y = gridHeight + playButton.height + (VERTICAL_OFFSET * 3);
}

function winningCalculation(symbolId: Symbols, amount: number) {
  return payoutTable[symbolId]?.[amount] || 0;
}

function checkWinningCombination(grid: string[]) {
  // 2d arrays representing payline ids visual description
  // For example first payline id check for the second row of the grid
  // So indexes 5,6,7,8,9 of the grid array and so on...
  const paylineIDs: number[][] = [
    [5, 6, 7, 8, 9],
    [0, 1, 2, 3, 4],
    [10, 11, 12, 13, 14],
    [0, 1, 7, 13, 14],
    [10, 11, 7, 3, 4],
    [0, 6, 12, 8, 4],
    [10, 6, 2, 8, 14],
  ];

  // List of all the symbols
  const symbols: Symbols[] = ["bar", "leaf", "seven", "bell", "orange", "apple", "lemon", "cherries"];

  // Contain all the winning combinations
  const lines: WinInfo[] = [];

  // for every symbols
  symbols.forEach((symbol) => {
    // Check for every payline id if there matching symbol combinations
    for (let i = 0; i < paylineIDs.length; i++) {
      const payline = paylineIDs[i];

      // check for sequential match  on every payline
      let count = 0;
      let j = 0;
      let found = false;

      // Find the first left most column then, continue counting from that point forward as long as symbols match
      while (j < 5) {
        if (!found) {
          if (symbol === grid[payline[j]]) {
            found = true;
            count = 1;
            j++;
          } else {
            j++;
          }
        } else {
          if (symbol === grid[payline[j]]) {
            count++;
            j++;
          } else {
            break;
          }
        }
      }

      // If there are 3 of Kind or more for a symbol, build winInfo object
      if (count >= 3) {
        const points = winningCalculation(symbol, count);
        const win: WinInfo = {
          paylineNumber: i + 1,
          symbol: symbol,
          symbolCount: count,
          points: points,
        };
        lines.push(win);
      }
    }
  });

  return lines;
}
