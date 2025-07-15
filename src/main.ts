import { Application, Sprite } from "pixi.js";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./config";
import { initDevtools } from "@pixi/devtools";
import { PixiPlugin } from "gsap/PixiPlugin";
import { gsap } from "gsap/gsap-core";
import {
  renderBg,
  renderDoor,
  renderHandle,
  renderHandleShadow,
  renderOpenDoor,
  renderOpenDoorShadow,
} from "./rendering";

gsap.registerPlugin(PixiPlugin);

// For calculating the rotation in the handle animation.
let currentRotation = 0;

type RotationStep = {
  direction: "clockwise" | "counterclockwise";
  rotations: number;
};

//Set storing the rotation combination that the player will need to do.
let rotationPuzzle = new Set<RotationStep>();

(async () => {
  const app = new Application();
  const bg = await renderBg();
  const door = await renderDoor();
  const handle = await renderHandle();
  const handleShadow = await renderHandleShadow();
  const openDoor = await renderOpenDoor();
  const openDoorShadow = await renderOpenDoorShadow();

  // Variables for safe unlock logic
  let currentStep = 0;
  let currentPosition = 0;

  // init App
  await app.init({
    width: innerWidth,
    height: innerHeight,
    resizeTo: window,
  });

  app.canvas.style.position = "absolute";
  document.body.appendChild(app.canvas);
  app.stage.scale.set(1);

  openDoorShadow.alpha = 0;
  openDoor.alpha = 0;

  initDevtools({ app });
  // Add the Assets needed
  app.stage.addChild(bg);
  app.stage.addChild(door);
  app.stage.addChild(handleShadow);
  app.stage.addChild(handle);
  app.stage.addChild(openDoorShadow);
  app.stage.addChild(openDoor);

  generateRandomCombination();

  let combination = Array.from(rotationPuzzle);

  let consoleHint = combination
    .map((value) => `${value.direction} ${value.rotations}`)
    .join(", ");

  console.log(consoleHint);

  door.eventMode = "static";
  door.cursor = "pointer";
  handleClick(door, handle, handleShadow);

  door.on("mousedown", (event) => {
    const localPos = event.getLocalPosition(door);
    const direction = localPos.x > 0 ? "clockwise" : "counterclockwise";
    const expected = combination[currentStep];

    if (direction !== expected.direction) {
      rotationPuzzle = new Set<RotationStep>();
      generateRandomCombination();
      combination = Array.from(rotationPuzzle);
      currentStep = 0;
      currentPosition = 0;

      consoleHint = combination
        .map((value) => `${value.direction} ${value.rotations}`)
        .join(", ");

      console.log(consoleHint);

      console.log("Nope");
      doWrongCombinationAnimation(handle, handleShadow);
      return;
    }

    currentPosition++;
    console.log(
      `Current position: ${currentPosition}, Current step: ${currentStep}, combination Rotations: ${combination[currentStep].rotations}, combination direction ${combination[currentStep].direction}`
    );

    if (currentPosition === combination[currentStep].rotations) {
      currentStep++;
      currentPosition = 0;
      console.log("Good job!");
    }

    if (currentStep === combination.length && currentPosition === 0) {
      console.log("You win");
      //todo logic for opening the door and showing the gold
    }
  });

  resizeApp(app);

  window.addEventListener("resize", () => {
    resizeApp(app);
  });
})();

// HELPER FUNCTIONS FROM THIS POINT ON

//Resize the canvas to the window size
function resizeApp(app: Application) {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Maintain 16:9 aspect ratio
  const scaleX = screenWidth / SCREEN_WIDTH;
  const scaleY = screenHeight / SCREEN_HEIGHT;
  const scale = Math.min(scaleX, scaleY); // preserve aspect ratio

  const newWidth = SCREEN_WIDTH * scale;
  const newHeight = SCREEN_HEIGHT * scale;

  // Resize the renderer (canvas)
  app.renderer.resize(screenWidth, screenHeight);

  // Scale the game stage
  app.stage.scale.set(scale);

  // Center the stage
  app.stage.position.set(
    (screenWidth - newWidth) / 2,
    (screenHeight - newHeight) / 2
  );
}

function generateRandomCombination() {
  for (let index = 0; index < 3; index++) {
    let direction = randomNumber(1, 2);
    let rotations = randomNumber(1, 9);
    rotationPuzzle.add({
      direction: direction === 1 ? "clockwise" : "counterclockwise",
      rotations: rotations,
    });
  }
}

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function handleClick(door: Sprite, handle: Sprite, handleShadow: Sprite) {
  door.on("mousedown", (event) => {
    const localPos = event.getLocalPosition(door);

    const direction = localPos.x > 0 ? "clockwise" : "counterclockwise";

    rotateHandle(direction);
  });

  function rotateHandle(direction: string) {
    const rotationStep = (60 * Math.PI) / 180;
    const delta = direction === "clockwise" ? rotationStep : -rotationStep;

    currentRotation += delta;

    console.log(currentRotation);

    gsap.to([handle, handleShadow], {
      duration: 1,
      rotation: currentRotation,
      ease: "power1.Out",
    });
  }
}

function doWrongCombinationAnimation(handle: Sprite, handleShadow: Sprite) {
  const rotationStep = (3200 * Math.PI) / 180;
  const randomRotationDirection =
    randomNumber(1, 2) === 1 ? rotationStep : -rotationStep;

  currentRotation += randomRotationDirection;

  gsap.to([handle, handleShadow], {
    duration: 3,
    rotation: currentRotation,
    ease: "power1.Out",
  });
}
