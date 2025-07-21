import { Application, Assets, Text } from "pixi.js";
import { scaleAndPosition, slotMachine } from "./slotMachine.ts";

// Create a PixiJS application.
const app = new Application();

// Pixi text to display preloaded loading progress
const loadingText = new Text({
  text: "Loading: 0%",
  style: {
    fontFamily: "Arial",
    fontSize: 30,
    align: "center",
  },
});

// Center text
loadingText.anchor.set(0.5, 0.5);
app.stage.addChild(loadingText);

// To keep track of progress and have the progress percentage increase on  the preload screen
let currentProgress: number = 0;
let targetProgress: number = 0;

async function setup() {
  // Initialize the application.
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);
}

async function preload() {
  // Create an array of asset data to load.
  const assets = [
    { alias: "bar", src: "assets/bar.png" },
    { alias: "leaf", src: "assets/four-leaf.png" },
    { alias: "seven", src: "assets/seven.png" },
    { alias: "bell", src: "assets/bell.png" },
    { alias: "orange", src: "assets/orange.png" },
    { alias: "apple", src: "assets/apple.png" },
    { alias: "lemon", src: "assets/lemon.png" },
    { alias: "cherries", src: "assets/cherries.png" },
    { alias: "button", src: "assets/spin.png" },
  ];

  // Load all assets
  await Assets.load(assets, (progress) => {
    targetProgress = Math.round(progress * 100);
  });

  app.stage.addChild(loadingText);
}

// Asynchronous Immediately Invoked Function Expression
(async () => {
  await setup();
  await preload();

  const { symbolContainer, spinButton, winningText } = slotMachine(app);
  // Hide the game area when assets are loading
  symbolContainer.visible = false;
  spinButton.visible = false;
  winningText.visible = false;

  app.ticker.add(() => {
    if (currentProgress < targetProgress) {
      currentProgress += (targetProgress - currentProgress) * 0.02; // For Smooth progress animation
    }

    // Update text
    loadingText.text = `Loading: ${Math.round(currentProgress)}%`;

    // When asset loading is complete and current progress in very close to 100
    // Hide loading text and the game area
    if (targetProgress === 100 && currentProgress > 99.9) {
      loadingText.visible = false;
      symbolContainer.visible = true;
      spinButton.visible = true;
      winningText.visible = true;
    }

    // Center loading text on page resize
    loadingText.position.set(app.screen.width / 2, app.screen.height / 2);

    // Center and scale machine
    scaleAndPosition(app, symbolContainer, spinButton, winningText);
  });
})();
