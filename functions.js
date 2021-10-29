export function spawnMystery(x, y) {
  if (chance(0.1)) {
    add([
      sprite("mystery"),
      pos(x, y),
      scale(0.1),
      origin("center"),
      area(),
      "mystery",
    ]);
  }
}

export function explode(item) {
  add([
    sprite("explosion"),
    pos(item.pos.x, item.pos.y),
    scale(0.2),
    origin("center"),
    lifespan(0.5, { fade: 0.5 }),
  ]);
  destroy(item);
}

export function fireLaser(rocket) {
  if (get("laser").length < rocket.laserLimit) {
    add([
      sprite("laser"),
      scale(0.05),
      rotate(270),
      pos(rocket.pos.x, rocket.pos.y - 100),
      origin("center"),
      area(),
      "laser",
    ]);
  }
}

export function spawnMeteor() {
  add([
    sprite("meteor"),
    pos(rand(0, width()), -height()),
    scale(0.2),
    origin("center"),
    rotate(0),
    area(),
    "meteor",
  ]);
}

export function restoreShield(player) {
  debug.log("SHIELD RESTORED TO 100%");
  player.shield = 100;
}

export function unlimitedLasers(player) {
  debug.log("UNLIMITED LASERS FOR 10 SECONDS");
  let originalLaserLimit = player.laserLimit;
  player.laserLimit = 9999;
  wait(10, () => {
    player.laserLimit = originalLaserLimit;
  });
}

export function freezeInvaders(settings, timeLimit = 10) {
  debug.log("INVADERS FROZEN FOR 10 SECONDS");
  let originalInvaderLaserChance = settings.invaderLaserChance;
  let originalMeteorChance = settings.meteorChance;
  let originalInvaderSpeed = settings.invaderSpeed;
  settings.invaderLaserChance = 0;
  settings.meteorChance = 0;
  settings.invaderSpeed = 0;
  wait(timeLimit, () => {
    settings.invaderLaserChance = originalInvaderLaserChance;
    settings.meteorChance = originalMeteorChance;
    settings.invaderSpeed = originalInvaderSpeed;
  });
}

export function aliensFire(settings) {
  every("invader-ship", (ship) => {
    if (chance(settings.invaderLaserChance)) {
      wait(rand(0, 3), () => {
        add([
          sprite("alien-laser"),
          pos(ship.pos.x, ship.pos.y + 30),
          rotate(270),
          scale(0.05),
          area(),
          "invader-laser",
        ]);
      });
    }
  });
}
