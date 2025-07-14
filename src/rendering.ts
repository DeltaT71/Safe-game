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
  sprite_door.anchor.set(0.47, 0.53);
  sprite_door.scale.set(0.31);

  return sprite_door;
}
export async function renderHandle() {
  const textuer_handle = (await loadAssets()).handle;
  const sprite_handle = Sprite.from(textuer_handle);

  scaleSprite(sprite_handle);

  // Adjust the position and size
  sprite_handle.anchor.set(0.54, 0.57);
  sprite_handle.scale.set(0.31);

  return sprite_handle;
}
export async function renderHandleShadow() {
  const textuer_handleShadow = (await loadAssets()).handleShadow;
  const sprite_handleShadow = Sprite.from(textuer_handleShadow);

  scaleSprite(sprite_handleShadow);
  // Adjust the position and size
  sprite_handleShadow.anchor.set(0.52, 0.54);
  sprite_handleShadow.scale.set(0.31);

  return sprite_handleShadow;
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
