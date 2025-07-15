import { Application, Sprite } from "pixi.js";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./config";
import { initDevtools } from "@pixi/devtools";
import { PixiPlugin } from "gsap/PixiPlugin";
import { gsap } from "gsap/gsap-core";
import {
  renderBg,
  renderDoor,
  renderGoldSparkle,
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
  const sparkle = await renderGoldSparkle();
  const sparkle2 = await renderGoldSparkle();
  const sparkle3 = await renderGoldSparkle();

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
  sparkle.alpha = 0;
  sparkle2.alpha = 0;
  sparkle3.alpha = 0;

  adjustSparklePositions(sparkle, sparkle2, sparkle3);

  initDevtools({ app });
  // Add the Assets needed
  app.stage.addChild(bg);
  app.stage.addChild(sparkle);
  app.stage.addChild(sparkle2);
  app.stage.addChild(sparkle3);
  app.stage.addChild(door);
  app.stage.addChild(handleShadow);
  app.stage.addChild(handle);
  app.stage.addChild(openDoorShadow);
  app.stage.addChild(openDoor);

  generateRandomCombination();

  let combination = Array.from(rotationPuzzle);

  displayCombinationInConsole(combination);

  door.eventMode = "static";
  door.cursor = "pointer";
  handleClick(door, handle, handleShadow);

  // Handles the logic for the game loop (Should prob be abstracted in the helper functions)
  door.on("mousedown", (event) => {
    const localPos = event.getLocalPosition(door);
    const direction = localPos.x > 0 ? "clockwise" : "counterclockwise";
    const expected = combination[currentStep];

    // If the player makes a wrong click we reset the game regenerate a new combination and start the wrong animations.
    if (direction !== expected.direction) {
      rotationPuzzle = new Set<RotationStep>();
      generateRandomCombination();
      combination = Array.from(rotationPuzzle);
      currentStep = 0;
      currentPosition = 0;

      displayCombinationInConsole(combination);
      doWrongCombinationAnimation(handle, handleShadow);
      return;
    }

    // Incrementing positions based on correct clicks
    currentPosition++;

    // If the player gets the first combination right we move to the next one.
    if (currentPosition === combination[currentStep].rotations) {
      currentStep++;
      currentPosition = 0;
    }

    // If the player wins we fade out the closed Sprites
    // fade in the open Sprites
    // Remove the closed sprites children from the canvas to prevent players from clicking and to save resources.
    if (currentStep === combination.length && currentPosition === 0) {
      fadeOutClosedDoorElements(door, handle, handleShadow);
      removeClosedDoorElements(door, handle, handleShadow, app);
      fadeInOpenDoorElements(openDoor, openDoorShadow);
      sparklePulseAnimationStart(sparkle, 0);
      sparklePulseAnimationStart(sparkle2, 0.3);
      sparklePulseAnimationStart(sparkle3, 0.5);
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

// Generates the random cumbination for each game.
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

// Random number generator fucntion for the Combinations
function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Handles the click event on the door depending on where the player clicks and creates the Animation for it
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

    gsap.to([handle, handleShadow], {
      duration: 1,
      rotation: currentRotation,
      ease: "power1.Out",
    });
  }
}

// Does the animation for the wrong input during the safe unlocking.
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
// Fades out the closed closed door handle and handle shadow Sprites
function fadeOutClosedDoorElements(
  door: Sprite,
  handle: Sprite,
  handleShadow: Sprite
) {
  gsap.to([door, handle, handleShadow], {
    duration: 2,
    alpha: 0,
    ease: "power1.Out",
  });
}

// Removes the closed door handle and handle shadow Sprites from the Stage
function removeClosedDoorElements(
  door: Sprite,
  handle: Sprite,
  handleShadow: Sprite,
  app: Application
) {
  app.stage.removeChild(door);
  app.stage.removeChild(handle);
  app.stage.removeChild(handleShadow);
}

// Fades in the open door and open door shadow Sprites
function fadeInOpenDoorElements(openDoor: Sprite, openDoorShadow: Sprite) {
  gsap.to([openDoor, openDoorShadow], {
    duration: 2,
    alpha: 1,
    ease: "power1.Out",
  });
}
// Takes the current Set combination and displays it in the console.
function displayCombinationInConsole(combination: RotationStep[]) {
  let consoleHint = combination
    .map((value) => `${value.direction} ${value.rotations}`)
    .join(", ");

  console.log(consoleHint);
}

// Adjusts each sparkle to a different position after rendering them.
function adjustSparklePositions(
  sparkle: Sprite,
  sparkle2: Sprite,
  sparkle3: Sprite
) {
  sparkle.x += 100;
  sparkle.y += 70;
  sparkle2.x -= 150;
  sparkle2.y += 120;
  sparkle3.x -= 40;
}

// Makes the sparkle pulse in and out animation.
function sparklePulseAnimationStart(sparkle: Sprite, delay: number = 0) {
  gsap.to(sparkle, {
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
    scale: 0.5,
    rotation: 1.4,
    alpha: 1,
    delay,
  });
}
