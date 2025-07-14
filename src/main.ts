import { Application } from "pixi.js";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./config";
import { initDevtools } from "@pixi/devtools";
import {
  renderBg,
  renderDoor,
  renderHandle,
  renderHandleShadow,
} from "./rendering";

(async () => {
  const app = new Application();

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

  // Bg
  app.stage.addChild(await renderBg());
  // Door
  app.stage.addChild(await renderDoor());
  //Handle Shadow
  app.stage.addChild(await renderHandleShadow());
  // Handle
  app.stage.addChild(await renderHandle());
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
