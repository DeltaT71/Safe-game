import { Sprite } from "pixi.js";
import { loadAssets } from "./assets";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./config";

export async function renderBg() {
  const texture_bg = (await loadAssets()).bg;
  const sprite_bg = Sprite.from(texture_bg);

  sprite_bg.scale.set(innerWidth, innerHeight);
  scaleSprite(sprite_bg);

  return sprite_bg;
}

export async function renderDoor() {
  const textrue_door = (await loadAssets()).door;
  const sprite_door = Sprite.from(textrue_door);

  sprite_door.scale.set();

  scaleSprite(sprite_door);

  // Adjust the position and size
  sprite_door.scale.set(0.35);
  sprite_door.x += 15;
  sprite_door.y -= 20;

  return sprite_door;
}
export async function renderHandle() {
  const textuer_handle = (await loadAssets()).handle;
  const sprite_handle = Sprite.from(textuer_handle);

  scaleSprite(sprite_handle);

  // Adjust the position and size
  sprite_handle.x -= 15;
  sprite_handle.y -= 20;
  sprite_handle.scale.set(0.35);

  return sprite_handle;
}
export async function renderHandleShadow() {
  const textuer_handleShadow = (await loadAssets()).handleShadow;
  const sprite_handleShadow = Sprite.from(textuer_handleShadow);

  scaleSprite(sprite_handleShadow);
  // Adjust the position and size
  sprite_handleShadow.scale.set(0.35);
  sprite_handleShadow.x -= 10;
  sprite_handleShadow.y -= 10;

  return sprite_handleShadow;
}

export async function renderOpenDoor() {
  const textuer_openDoor = (await loadAssets()).openDoor;
  const sprite_openDoor = Sprite.from(textuer_openDoor);

  scaleSprite(sprite_openDoor);
  // Adjust the position and size
  sprite_openDoor.scale.set(0.36);
  sprite_openDoor.x += 510;
  sprite_openDoor.y -= 25;

  return sprite_openDoor;
}

export async function renderOpenDoorShadow() {
  const textuer_openDoorShadow = (await loadAssets()).doorOpenShadow;
  const sprite_doorOpenShadow = Sprite.from(textuer_openDoorShadow);

  scaleSprite(sprite_doorOpenShadow);
  // Adjust the position and size
  sprite_doorOpenShadow.scale.set(0.35);
  sprite_doorOpenShadow.x += 540;
  sprite_doorOpenShadow.y += 50;

  return sprite_doorOpenShadow;
}

//Keeps the aspect ratio of Sprites and anchors them to the middle
function scaleSprite(sprite: Sprite) {
  sprite.scale.set(1);

  const scaleX = SCREEN_WIDTH / sprite.width;
  const scaleY = SCREEN_HEIGHT / sprite.height;
  const scale = Math.max(scaleX, scaleY); // fill entire screen

  sprite.scale.set(scale);

  sprite.anchor.set(0.5);
  sprite.x = SCREEN_WIDTH / 2;
  sprite.y = SCREEN_HEIGHT / 2;
}
