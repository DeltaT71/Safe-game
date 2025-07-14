import { Application } from "pixi.js";

(async () => {
  const app = new Application();

  await app.init({
    resizeTo: window,
  });

  app.canvas.style.position = "absolute";
  document.body.appendChild(app.canvas);
})();
