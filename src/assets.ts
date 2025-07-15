import { Assets } from "pixi.js";

// Loads all game assets and returns them in an object.
export async function loadAssets() {
  await Assets.load([
    "/images/assets/bg.png",
    "/images/assets/blink.png",
    "/images/assets/door.png",
    "/images/assets/doorOpen.png",
    "/images/assets/doorOpenShadow.png",
    "/images/assets/handle.png",
    "/images/assets/handleShadow.png",
  ]);

  return {
    bg: Assets.get("/images/assets/bg.png"),
    blink: Assets.get("/images/assets/blink.png"),
    door: Assets.get("/images/assets/door.png"),
    openDoor: Assets.get("/images/assets/doorOpen.png"),
    doorOpenShadow: Assets.get("/images/assets/doorOpenShadow.png"),
    handle: Assets.get("/images/assets/handle.png"),
    handleShadow: Assets.get("/images/assets/handleShadow.png"),
  };
}
