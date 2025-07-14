import { Application, Container, Sprite } from "pixi.js";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./config";
import { initDevtools } from "@pixi/devtools";
import { PixiPlugin } from "gsap/PixiPlugin";
import { gsap } from "gsap/gsap-core";
import {
  renderBg,
  renderDoor,
  renderHandle,
  renderHandleShadow,
} from "./rendering";

gsap.registerPlugin(PixiPlugin);

// For calculating the rotation in the handle animation.
let currentRotation = 0;

type RotationStep = {
  direction: "clockwise" | "counterclockwise";
  rotations: number;
};

(async () => {
  const app = new Application();
  const rotationPuzzle = new Set<RotationStep>();

  const bg = await renderBg();
  const door = await renderDoor();
  const handle = await renderHandle();
  const handleShadow = await renderHandleShadow();

  // init App
  await app.init({
    width: innerWidth,
    height: innerHeight,
    resizeTo: window,
  });

  app.canvas.style.position = "absolute";
  document.body.appendChild(app.canvas);
  app.stage.scale.set(1);

  initDevtools({ app });

  for (let index = 0; index < 3; index++) {
    let direction = randomNumber(1, 2);
    let rotations = randomNumber(1, 9);
    rotationPuzzle.add({
      direction: direction === 1 ? "clockwise" : "counterclockwise",
      rotations: rotations,
    });
  }

  const consoleHint = Array.from(rotationPuzzle)
    .map((value) => `${value.direction} ${value.rotations}`)
    .join(", ");

  console.log(consoleHint);

  // Bg
  app.stage.addChild(bg);
  // Door
  app.stage.addChild(door);
  //Handle and Handle Shadow
  app.stage.addChild(handleShadow);
  app.stage.addChild(handle);
  handleAnimation(door, handle, handleShadow);

  resizeApp(app);

  window.addEventListener("resize", () => {
    resizeApp(app);
  });
})();

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

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function handleAnimation(door: Sprite, handle: Sprite, handleShadow: Sprite) {
  door.eventMode = "static";
  door.cursor = "pointer";

  door.on("mousedown", (event) => {
    const localPos = event.getLocalPosition(door);

    const direction = localPos.x > 0 ? "clockwise" : "counterclockwise";

    rotateHandle(direction);
  });

  function rotateHandle(direction) {
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
