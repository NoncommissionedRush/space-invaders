import {
  aliensFire,
  explode,
  fireLaser,
  freezeInvaders,
  restoreShield,
  spawnMeteor,
  spawnMystery,
  unlimitedLasers,
} from "../functions";

export default function Game(score = 0, level = 1, shield = 100) {
  let gameScore = score;
  let gameLevel = level;
  let SETTINGS = {
    rocketSpeed: 300,
    invaderSpeed: 70 + gameLevel * 50,
    invaderLaserChance: level / 10,
    meteorChance: 0.1,
  };

  const levelLayout = [
    "#^^^^^^^^^^     *",
    "#@@@@@@@@@@     *",
    "#@@@@@@@@@@     *",
    "#@@@@@@@@@@     *",
    "#@@@@@@@@@@     *",
    "#               *",
    "#               *",
    "#               *",
    "#  -    -    -  *",
    "#               *",
    "#               *",
    "#               *",
  ];

  add([sprite("bg"), { width: width(), height: height() }]);
  addLevel(levelLayout, {
    width: width() / 17,
    height: height() / 12,
    "#": () => [
      rect(width() / 17, height() / 12),
      area(),
      color(0, 0, 0),
      opacity(0),
      "left-wall",
    ],
    "*": () => [
      rect(width() / 17, height() / 12),
      area(),
      color(0, 0, 0),
      opacity(0),
      "right-wall",
    ],
    "@": () => [
      sprite("invader"),
      area(),
      scale(0.1),
      origin("center"),
      "invader",
    ],
    "^": () => [
      sprite("green-ship"),
      area(),
      scale(0.08),
      origin("center"),
      "invader",
      "invader-ship",
    ],
    "-": () => [
      sprite("force-field"),
      area(),
      origin("center"),
      "shield",
      scale(1),
      { life: 15 },
    ],
  });

  // ROCKET
  const rocket = add([
    sprite("rocket"),
    pos(width() / 2, height() - 50),
    scale(0.1),
    origin("center"),
    area(),
    "rocket",
    { shield: shield, laserLimit: level },
  ]);

  // SCOREBOARD
  const scoreBoard = add([
    text(`SCORE:${gameScore}`, { font: "sink", size: 30 }),
    pos(20, 60),
  ]);

  // SHIELD BAR
  add([text("SHIELD: ", { font: "sink", size: 30 }), pos(20, 10)]);

  const shieldBar = add([
    rect(rocket.shield, 40),
    pos(180, 5),
    color(0, 255, 0),
  ]);

  //    KEYS
  keyDown("left", () => {
    rocket.move(-SETTINGS.rocketSpeed, 0);
  });

  keyDown("right", () => {
    rocket.move(SETTINGS.rocketSpeed, 0);
  });

  keyDown("up", () => {
    rocket.move(0, -200);
  });

  keyDown("down", () => {
    rocket.move(0, 200);
  });

  keyPress("space", () => {
    fireLaser(rocket);
  });

  //   ACTIONS
  action("invader", (invader) => {
    invader.move(SETTINGS.invaderSpeed, 0);

    if (invader.pos.y <= 0) {
      go("gameover", gameScore);
    }
  });

  action("laser", (laser) => {
    laser.move(0, -200);

    if (laser.pos.y < 0) {
      destroy(laser);
    }
  });

  loop(1, () => {
    aliensFire(SETTINGS);

    if (chance(SETTINGS.meteorChance)) {
      spawnMeteor();
    }
  });

  action("meteor", (meteor) => {
    meteor.move(rand(0, 90), 400);
    meteor.angle += 1;
    if (meteor.pos.y > height()) {
      destroy(meteor);
    }
  });

  action("invader-laser", (laser) => {
    laser.move(0, 300);
    if (laser.pos.y > height()) {
      destroy(laser);
    }
  });

  action("mystery", (mystery) => {
    mystery.move(0, 200);
    if (mystery.pos.y > height()) {
      destroy(mystery);
    }
  });

  action(() => {
    if (get("invader").length === 0) {
      gameLevel += 1;
      go("game", gameScore, gameLevel, rocket.shield);
    }
  });

  //    COLLISIONS
  collides("invader", "right-wall", () => {
    SETTINGS.invaderSpeed = -Math.abs(SETTINGS.invaderSpeed);
    every("invader", (invader) => {
      invader.move(0, Math.abs(SETTINGS.invaderSpeed));
    });
  });

  collides("invader", "left-wall", () => {
    SETTINGS.invaderSpeed = Math.abs(SETTINGS.invaderSpeed);
    every("invader", (invader) => {
      invader.move(0, Math.abs(SETTINGS.invaderSpeed) / 2);
    });
  });

  collides("invader-laser", "shield", (laser, shield) => {
    shield.life -= 1;
    shield.opacity = shield.life / 10;
    shake(4);
    explode(laser);

    if (shield.life === 0) {
      destroy(shield);
    }
  });

  collides("meteor", "shield", (meteor, shield) => {
    shield.life -= 5;
    shield.opacity = shield.life / 10;
    shake(5);
    explode(meteor);

    if (shield.life < 1) {
      destroy(shield);
    }
  });

  collides("laser", "invader", (laser, invader) => {
    shake(4);
    destroy(laser);
    explode(invader);
    gameScore += 10;
    scoreBoard.text = `SCORE: ${gameScore}`;
    spawnMystery(invader.pos.x, invader.pos.y);
  });

  collides("laser", "invader-ship", (laser, ship) => {
    shake(4);
    destroy(laser);
    destroy(ship);
    gameScore += 50;
    scoreBoard.text = gameScore;
  });

  collides("rocket", "invader", () => {
    go("gameover", gameScore);
  });

  collides("invader-laser", "rocket", (laser, rocket) => {
    shake(4);
    explode(laser);
    rocket.shield -= 10;
    shieldBar.width = rocket.shield;
    if (rocket.shield < 0) {
      go("gameover", gameScore);
    }
  });

  collides("meteor", "rocket", (meteor, rocket) => {
    shake(5);
    explode(meteor);
    rocket.shield -= 50;
    shieldBar.width = rocket.shield;
    if (rocket.shield < 0) {
      go("gameover", gameScore);
    }
  });

  collides("mystery", "rocket", (mystery, rocket) => {
    let pick = choose(["restoreShield", "unlimitedLasers", "freezeInvaders"]);
    if (pick === "restoreShield") {
      restoreShield(rocket);
    }
    if (pick === "unlimitedLasers") {
      unlimitedLasers(rocket);
    }

    if (pick === "freezeInvaders") {
      freezeInvaders(SETTINGS);
    }

    destroy(mystery);
  });
}
