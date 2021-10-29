import kaboom from "kaboom";
import Game from "./scenes/game";
import GameOver from "./scenes/gameover";
import Landing from "./scenes/landing";

kaboom({
  background: [29, 41, 81],
});

loadSprite("landing", "./sprites/landing.png");
loadSprite("invader", "./sprites/invader.png");
loadSprite("green-ship", "./sprites/green-ship.png");
loadSprite("rocket", "./sprites/rocket.png");
loadSprite("laser", "./sprites/laser.png");
loadSprite("alien-laser", "./sprites/alien-laser.png");
loadSprite("explosion", "./sprites/explosion.jpg");
loadSprite("bg", "./sprites/bg.png");
loadSprite("force-field", "./sprites/force-field.png");
loadSprite("meteor", "./sprites/meteor.png");
loadSprite("mystery", "./sprites/mystery.png");

scene("landing", Landing);
scene("game", Game);
scene("gameover", GameOver);

go("landing", {});
